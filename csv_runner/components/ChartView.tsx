"use client";
import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { normalizeRowProps } from "@/lib/csvNormalization";
import { DashboardMetrics } from "@/lib/metrics";
import dayjs from "dayjs";

interface ChartViewProps {
  metrics: DashboardMetrics;
  data: normalizeRowProps[];
}

export default function ChartView({ metrics, data }: ChartViewProps) {
  const [selectedPerson, setSelectedPerson] = useState<string>("All");

  // Get unique people for filter dropdown
  const people = useMemo(() => {
    const uniquePeople = Array.from(new Set(data.map((row) => row.person)));
    return ["All", ...uniquePeople.sort()];
  }, [data]);

  // Prepare time series data - aggregate by date and person
  const timeSeriesData = useMemo(() => {
    // Filter data by selected person if not "All"
    const filteredData =
      selectedPerson === "All"
        ? data
        : data.filter((row) => row.person === selectedPerson);

    // Group by date and person
    const dateMap = new Map<string, Record<string, number>>();

    filteredData.forEach((row) => {
      const dateKey = dayjs(row.date).format("YYYY-MM-DD");
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {});
      }
      const dateData = dateMap.get(dateKey)!;
      dateData[row.person] = (dateData[row.person] || 0) + row.milesRun;
      dateData.date = dayjs(dateKey).valueOf(); // For sorting
    });

    // Convert to array and sort by date
    const sortedData = Array.from(dateMap.entries())
      .map(([dateKey, personData]) => {
        const date = dayjs(dateKey);
        return {
          date: dateKey,
          dateLabel: date.format("MM/DD"),
          ...personData,
        };
      })
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

    return sortedData;
  }, [data, selectedPerson]);

  // Prepare bar chart data
  const barChartData = useMemo(() => {
    if (selectedPerson === "All") {
      return metrics.runByPerson.map((person) => ({
        name: person.person,
        totalMiles: person.totalMiles,
        averageMiles: person.averageMiles,
      }));
    } else {
      const personMetric = metrics.runByPerson.find(
        (p) => p.person === selectedPerson
      );
      return personMetric
        ? [
            {
              name: personMetric.person,
              totalMiles: personMetric.totalMiles,
              averageMiles: personMetric.averageMiles,
            },
          ]
        : [];
    }
  }, [metrics, selectedPerson]);

  // Bright, vibrant chart colors - using hex colors for better visibility
  const chartColors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Orange
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#ec4899", // Pink
  ];

  // Get unique people in time series data for line colors
  const peopleInData = useMemo(() => {
    if (selectedPerson !== "All") return [selectedPerson];
    return Array.from(new Set(data.map((row) => row.person))).sort();
  }, [data, selectedPerson]);

  // Text color for better contrast
  const textColor = "hsl(var(--muted-foreground))";

  return (
    <div className="space-y-6">
      {/* Filter Dropdown */}
      <div className="p-4 bg-card border rounded-lg">
        <label
          htmlFor="person-filter"
          className="block text-sm font-medium mb-2"
        >
          Filter by Person
        </label>
        <select
          id="person-filter"
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Filter charts by person"
        >
          {people.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </select>
      </div>

      {/* Line Chart: Miles Over Time by Person */}
      <div className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">
          Miles Over Time {selectedPerson !== "All" ? `(${selectedPerson})` : ""}
        </h2>
        <div role="img" aria-label="Line chart showing miles run over time">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: textColor, fontSize: 12 }}
                label={{
                  value: "Date",
                  position: "insideBottom",
                  offset: -5,
                  style: { fill: textColor, fontSize: 12 },
                }}
              />
              <YAxis
                tick={{ fill: textColor, fontSize: 12 }}
                label={{
                  value: "Miles",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: textColor, fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ 
                  color: "hsl(var(--foreground))",
                  fontWeight: 600,
                  fontSize: 14,
                }}
                itemStyle={{ 
                  color: "hsl(var(--foreground))",
                  fontWeight: 500,
                }}
              />
              <Legend 
                wrapperStyle={{ color: textColor }}
                iconType="line"
              />
              {peopleInData.map((person, index) => (
                <Line
                  key={person}
                  type="monotone"
                  dataKey={person}
                  stroke={chartColors[index % chartColors.length]}
                  strokeWidth={3}
                  name={person}
                  dot={{ 
                    fill: chartColors[index % chartColors.length], 
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#fff"
                  }}
                  activeDot={{ r: 7 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Total Miles by Person */}
      <div className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">
          Total Miles by Person {selectedPerson !== "All" ? `(${selectedPerson})` : ""}
        </h2>
        <div role="img" aria-label="Bar chart showing total miles run by each person">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barChartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: textColor, fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: textColor, fontSize: 12 }}
                label={{
                  value: "Miles",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: textColor, fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ 
                  color: "hsl(var(--foreground))",
                  fontWeight: 600,
                  fontSize: 14,
                }}
                itemStyle={{ 
                  color: "hsl(var(--foreground))",
                  fontWeight: 500,
                }}
              />
              <Legend 
                wrapperStyle={{ color: textColor }}
              />
              <Bar
                dataKey="totalMiles"
                fill={chartColors[0]}
                name="Total Miles"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Average Miles by Person */}
      <div className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">
          Average Miles per Run {selectedPerson !== "All" ? `(${selectedPerson})` : ""}
        </h2>
        <div role="img" aria-label="Bar chart showing average miles per run by each person">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barChartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: textColor, fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: textColor, fontSize: 12 }}
                label={{
                  value: "Miles",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: textColor, fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ 
                  color: "hsl(var(--foreground))",
                  fontWeight: 600,
                  fontSize: 14,
                }}
                itemStyle={{ 
                  color: "hsl(var(--foreground))",
                  fontWeight: 500,
                }}
              />
              <Legend 
                wrapperStyle={{ color: textColor }}
              />
              <Bar
                dataKey="averageMiles"
                fill={chartColors[1]}
                name="Average Miles"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import RawTable from "@/components/RawTable";
import FileUploader from "@/components/FileUploader";
import ChartView from "@/components/ChartView";
import { calculateMetrics, DashboardMetrics } from "@/lib/metrics";
import { Download, FileText } from "lucide-react";

export default function Home() {
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate metrics whenever parsedData changes
  useEffect(() => {
    if (parsedData.length > 0) {
      const calculatedMetrics = calculateMetrics(parsedData);
      setMetrics(calculatedMetrics);
    } else {
      setMetrics(null);
    }
  }, [parsedData]);

  // Sample CSV content for download
  const sampleCSV = `date,person,miles run
2024-01-15,John Smith,5.2
2024-01-17,Jane Doe,3.8
2024-01-18,John Smith,4.5
2024-01-19,Jane Doe,6.2
2024-01-20,Bob Johnson,7.1`;

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_running_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">CSV Runner Dashboard</h1>
      
      <FileUploader onDataParsed={setParsedData} onLoadingChange={setIsLoading} />
      
      {/* Empty State */}
      {!parsedData.length && !isLoading && (
        <div className="p-8 bg-card border rounded-lg text-center space-y-4">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">No CSV file uploaded</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload a CSV file with columns: <code className="bg-muted px-2 py-1 rounded">date</code>, <code className="bg-muted px-2 py-1 rounded">person</code>, and <code className="bg-muted px-2 py-1 rounded">miles run</code>
            </p>
          </div>
          <button
            onClick={downloadSampleCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Download sample CSV file"
          >
            <Download className="h-4 w-4" />
            Download Sample CSV
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Processing CSV file...</p>
          </div>
        </div>
      )}

      {/* Display Metrics */}
      {metrics && !isLoading && (
        <div className="space-y-4">
          {/* Overall Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-card border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Miles</p>
              <p className="text-2xl font-bold">{metrics.totalMiles.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Runs</p>
              <p className="text-2xl font-bold">{metrics.totalRuns}</p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <p className="text-sm text-muted-foreground">Average Miles/Run</p>
              <p className="text-2xl font-bold">{metrics.averageMilesPerRun.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <p className="text-sm text-muted-foreground">Min Miles</p>
              <p className="text-2xl font-bold">{metrics.minMiles.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <p className="text-sm text-muted-foreground">Max Miles</p>
              <p className="text-2xl font-bold">{metrics.maxMiles.toFixed(2)}</p>
            </div>
          </div>

          {/* Person Metrics Table */}
          {metrics.runByPerson.length > 0 && (
            <div className="p-4 bg-card border rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Metrics by Person</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Person</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Total Miles</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Run Count</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Average Miles</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Min Miles</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Max Miles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.runByPerson.map((person, index) => (
                      <tr key={index} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium">{person.person}</td>
                        <td className="px-4 py-3 text-sm">{person.totalMiles.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">{person.runCount}</td>
                        <td className="px-4 py-3 text-sm">{person.averageMiles.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">{person.minMiles.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">{person.maxMiles.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Charts */}
          <ChartView metrics={metrics} data={parsedData} />
        </div>
      )}

      {/* Data Info */}
      {parsedData.length > 0 && !isLoading && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Total rows parsed: <span className="font-bold text-foreground">{parsedData.length}</span>
          </p>
        </div>
      )}

      {/* Raw Data Table */}
      {parsedData.length > 0 && !isLoading && <RawTable data={parsedData} />}
    </div>
  );
}
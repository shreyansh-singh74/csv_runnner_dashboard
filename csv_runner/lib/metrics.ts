import { normalizeRowProps } from "./csvNormalization";

export interface PersonMetrics{
    person: string;
    totalMiles: number;
    runCount: number;
    averageMiles: number;
    minMiles: number;
    maxMiles: number;
}

export interface DashboardMetrics{
    totalMiles: number;
    totalRuns: number;
    averageMilesPerRun: number;
    minMiles: number;
    maxMiles: number;
    runByPerson: PersonMetrics[];
}

export function calculateMetrics(normalizedRows: normalizeRowProps[]): DashboardMetrics{
    const personMetrics: Record<string, PersonMetrics> = {};

    normalizedRows.forEach(row => {
        if(!personMetrics[row.person]){
            personMetrics[row.person] = {
                person: row.person,
                totalMiles: 0,
                runCount: 0,
                averageMiles: 0,
                minMiles: row.milesRun,
                maxMiles: row.milesRun,
            };
        }

        personMetrics[row.person].totalMiles += row.milesRun;
        personMetrics[row.person].runCount++;
        // Update min/max for person
        if(row.milesRun < personMetrics[row.person].minMiles) {
            personMetrics[row.person].minMiles = row.milesRun;
        }
        if(row.milesRun > personMetrics[row.person].maxMiles) {
            personMetrics[row.person].maxMiles = row.milesRun;
        }
    });

    // Average Calculation
    const runByPerson: PersonMetrics[] = Object.values(personMetrics).map(personMetrics => ({
        ...personMetrics,
        averageMiles: personMetrics.runCount > 0 ? personMetrics.totalMiles / personMetrics.runCount : 0,
    }));

    // Overall
    const totalRuns = normalizedRows.length;
    const totalMiles = normalizedRows.reduce((sum, row)=> sum + row.milesRun, 0);
    const averageMilesPerRun = totalRuns > 0 ? totalMiles / totalRuns : 0;
    const minMiles = normalizedRows.length > 0 
        ? Math.min(...normalizedRows.map(row => row.milesRun))
        : 0;
    const maxMiles = normalizedRows.length > 0
        ? Math.max(...normalizedRows.map(row => row.milesRun))
        : 0;
    
    return{
        totalMiles,
        totalRuns,
        averageMilesPerRun,
        minMiles,
        maxMiles,
        runByPerson,
    };
}
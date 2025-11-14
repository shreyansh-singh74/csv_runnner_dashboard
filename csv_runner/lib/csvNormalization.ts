import dayjs from "dayjs";
import { ACCEPTED_DATE_FORMATS } from "./csvValidation";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export interface normalizeRowProps{
    date: Date
    person: string
    milesRun: number 
}

export function normalizeRow(rawRow: any): normalizeRowProps{
    const {date, person, "miles run": milesRun} = rawRow;
    let check = false;
    let parsedDate = null;
    for(const format of ACCEPTED_DATE_FORMATS){
        if(dayjs(date, format, true).isValid()){
            check = true;
            parsedDate = dayjs(date, format).toDate();
            break;
        }
    }

    if(!check){
        throw new Error(`Invalid date format. Accepted formats: ${ACCEPTED_DATE_FORMATS.join(", ")}`);
    }

    return {
        date: parsedDate as Date,
        person: person.trim(),
        milesRun: parseFloat(milesRun) || 0,
    }
}

export function normalizeRows(rawRows: any[]): normalizeRowProps[]{
    return rawRows.map((row, index) => {
        try {
            return normalizeRow(row);
        } catch (error) {
            throw new Error(`Error normalizing row ${index + 1}: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
}
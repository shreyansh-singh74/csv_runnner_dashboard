import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const EXPECTED_HEADERS = ["date", "person", "miles run"];

export const ACCEPTED_DATE_FORMATS = [
    "YYYY-MM-DD",
    "MM/DD/YYYY",
    "DD-MM-YYYY",
];

export interface RowError{
    row: number;
    field: string;
    message: string;
}

export interface ValidationResult{
    validRows: any[];
    errors: RowError[];
    headerError?: string;
}

function isValidDate(dateString:string):boolean{
    if(!dateString || dateString.trim() === ""){
        return false;
    }

    for(const format of ACCEPTED_DATE_FORMATS){
        if(dayjs(dateString, format, true).isValid()){
            return true;
        }
    }

    return false;
}

function isValidPerson(person: string):boolean{
    return !!person && person.trim().length > 0;
}

function isValidMiles(milesString: string):boolean{
    const miles = parseFloat(milesString);
    return !isNaN(miles) && miles >= 0;
}

// Main validation function
export function validateCsv(headers: string[], rows: any[]): ValidationResult {
    const errors: RowError[] = [];
    const validRows: any[] = [];
    
    // Step 1: Validate headers (fatal error if wrong)
    const normalizedHeaders = headers.map(h => h.trim().toLowerCase());
    const expectedNormalized = EXPECTED_HEADERS.map(h => h.toLowerCase());
    
    if (JSON.stringify(normalizedHeaders) !== JSON.stringify(expectedNormalized)) {
      return {
        validRows: [],
        errors: [],
        headerError: `Invalid headers. Expected: ${EXPECTED_HEADERS.join(", ")}. Got: ${headers.join(", ")}`
      };
    }
    
    // Step 2: Validate each row
    rows.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because: +1 for 0-index, +1 for header row
      const rowErrors: string[] = [];
      
      // Validate date
      if (!isValidDate(row.date)) {
        rowErrors.push(`Invalid date format. Accepted formats: ${ACCEPTED_DATE_FORMATS.join(", ")}`);
        errors.push({
          row: rowNumber,
          field: "date",
          message: `Invalid date format. Accepted formats: ${ACCEPTED_DATE_FORMATS.join(", ")}`
        });
      }
      
      // Validate person
      if (!isValidPerson(row.person)) {
        rowErrors.push("Person cannot be empty");
        errors.push({
          row: rowNumber,
          field: "person",
          message: "Person cannot be empty"
        });
      }
      
      // Validate miles run
      if (!isValidMiles(row["miles run"])) {
        rowErrors.push("Miles must be a number >= 0");
        errors.push({
          row: rowNumber,
          field: "miles run",
          message: "Miles must be a number >= 0"
        });
      }
      
      // If row has no errors, add to valid rows
      if (rowErrors.length === 0) {
        validRows.push(row);
      }
    });
    
    return {
      validRows,
      errors
    };
  }
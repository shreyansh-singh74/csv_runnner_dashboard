"use client";
import { useState } from "react";
import Papa from "papaparse";
import { Alert, AlertDescription } from "./ui/alert";
import {
  validateCsv,
  EXPECTED_HEADERS,
  ACCEPTED_DATE_FORMATS,
  RowError,
} from "@/lib/csvValidation";
interface FileUploaderProps {
  onDataParsed: (data: any[]) => void;
  onValidationErrors?: (errors: RowError[]) => void;
}

export default function FileUploader({
  onDataParsed,
  onValidationErrors,
}: FileUploaderProps) {
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<RowError[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file");
      setFileName("");
      return;
    }

    // Clear previous errors
    setError(null);
    setFileName(file.name);

    // Parse CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError("Error parsing CSV file");
          return;
        }

        // Extract headers from parsed results
        const headers = results.meta.fields || [];

        // Validate CSV
        const validationResult = validateCsv(headers, results.data);

        // Check for fatal header error
        if (validationResult.headerError) {
          setError(validationResult.headerError);
          setValidationErrors([]);
          onDataParsed([]);
          return;
        }

        // Store validation errors
        setValidationErrors(validationResult.errors);
        if (onValidationErrors) {
          onValidationErrors(validationResult.errors);
        }

        // Pass only valid rows to parent
        onDataParsed(validationResult.validRows);

        // Clear header error if validation passed
        setError(null);
      },
      error: (error) => {
        setError(`Failed to parse file: ${error.message}`);
      },
    });
  };

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />

        {fileName && (
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium">{fileName}</span>
          </p>
        )}
        {validationErrors.length > 0 && (
          <div className="mt-4">
            <Alert className="mb-2">
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">
                    ⚠️ Found {validationErrors.length} validation error(s)
                  </p>
                  <p className="text-sm">
                    Valid rows have been accepted. Invalid rows are listed
                    below.
                  </p>
                  <button
                    onClick={() => setShowErrors(!showErrors)}
                    className="text-sm text-primary underline hover:no-underline"
                  >
                    {showErrors ? "Hide errors" : "Show errors"}
                  </button>
                </div>
              </AlertDescription>
            </Alert>

            {showErrors && (
              <div className="max-h-60 overflow-y-auto border rounded p-4 bg-muted/50">
                <div className="space-y-2">
                  {validationErrors.slice(0, 10).map((err, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-semibold">Row {err.row}</span> -
                      <span className="text-destructive"> {err.field}</span>:{" "}
                      {err.message}
                    </div>
                  ))}
                  {validationErrors.length > 10 && (
                    <p className="text-sm text-muted-foreground italic mt-2">
                      ... and {validationErrors.length - 10} more error(s)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

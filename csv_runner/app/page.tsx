"use client";
import { useState } from "react";
import RawTable from "@/components/RawTable";
import FileUploader from "@/components/FileUploader";

export default function Home() {
  const [parsedData, setParsedData] = useState<any[]>([]);
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">CSV Runner Dashboard</h1>
      
      <FileUploader onDataParsed={setParsedData} />
      
      {parsedData.length > 0 && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Total rows parsed: <span className="font-bold text-foreground">{parsedData.length}</span>
          </p>
        </div>
      )}
      <RawTable data={parsedData} />
      
    </div>
  );
}
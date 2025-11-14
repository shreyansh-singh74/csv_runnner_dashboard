# CSV Runner Dashboard

A Next.js + shadcn/ui application for uploading and analyzing running data from CSV files. Users upload a CSV with the columns **date**, **person**, and **miles run** to view summary metrics and visualizations.

## Project Overview

This project implements the CSV Runner Dashboard challenge. It parses CSV files, validates headers and data types, computes overall and per-person metrics (average, min, max), and provides at least one meaningful chart along with per-person views.

## Assumptions

* Required headers: `date`, `person`, `miles run`
* Supported date formats: `YYYY-MM-DD`, `MM/DD/YYYY`, `DD-MM-YYYY`
* Person must be a non-empty string
* Miles must be numeric and ≥ 0
* Invalid rows are reported with specific error messages
* Dates are normalized before visualization

## Prerequisites

* Node.js 18+
* npm 9+
* No local database required

## Setup

### Install

```bash
npm install
```

### Environment

No environment variables are used.
An empty `.env.example` file is included for compliance.

### Seed Data

A sample CSV file is available at:

```
public/sample_running_data.csv
```

Use it to verify charts, metrics, and validation.

## Run & Verify

### Start Development

```bash
npm run dev
```

The application runs at:

```
http://localhost:3000
```

### Build & Run Production

```bash
npm run build
npm start
```

### Step-by-Step Verification (Acceptance Checklist)

1. **Sample CSV & Instructions**

   * Download sample CSV from the empty dashboard state.
   * Verify correct header format.

2. **Overall and Per-Person Charts/Views**

   * Upload a valid CSV.
   * Confirm:

     * Overall metrics (average, min, max).
     * Metrics per person.
     * At least one chart (line or bar).
     * Person filter updates views.

3. **Metrics Computed Correctly**

   * Total, average, min, max computed for both overall and per-person.
   * Values update automatically based on uploaded data.

4. **Error Handling for Invalid CSV**

   * Wrong headers → header error.
   * Invalid date → row-level error.
   * Empty person → error.
   * Non-numeric miles → error.
   * Non-CSV file → rejected.

## Features & Limitations

### Features

* CSV parsing with header and type validation
* Multiple date formats supported
* Overall and per-person metrics
* Line and bar charts
* Person filtering
* Clear error messages
* Responsive and accessible UI

### Limitations

* No date range filters
* No export functionality
* No data persistence
* Limited to the specified three date formats

## Notes on Architecture

### Folder Structure

```
app/                    Pages and global layout
components/             FileUploader, charts, tables, UI components
lib/                    CSV validation, normalization, metrics
public/                 Sample CSV file
```

### Key Components

* **FileUploader**: Handles CSV upload, parsing, validation
* **ChartView**: Renders line and bar charts
* **RawTable**: Displays raw normalized input
* **metrics.ts**: Computes overall and per-person statistics

### Data Approach

```
Upload → Parse → Validate → Normalize → Compute Metrics → Render Charts/Tables
```

## Accessibility & UI

* Accessible file input and filters
* Semantic HTML structure
* Keyboard navigation support
* Adequate spacing and readable typography
* Color contrast follows UI best practices


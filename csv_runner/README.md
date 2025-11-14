# CSV Runner Dashboard

A Next.js dashboard application for visualizing and analyzing running data from CSV files. Users can upload CSV files containing running records (date, person, miles run) and explore comprehensive metrics and interactive charts.

## Project Overview

This project implements the **CSV Runner Dashboard** challenge that allows users to:
- Upload and parse CSV files with running data
- Validate CSV headers and data types with detailed error reporting
- Visualize data through multiple chart types (line charts, bar charts)
- Calculate and display metrics: total, average, min, max (overall and per-person)
- Filter charts by person for focused analysis
- Handle errors gracefully with clear validation messages

**Built with:** Next.js 16, React 19, TypeScript, Recharts, Tailwind CSS, shadcn/ui

## Assumptions

1. **Date Formats**: Supports three date formats: `YYYY-MM-DD`, `MM/DD/YYYY`, and `DD-MM-YYYY`
2. **CSV Headers**: Must exactly match: `date`, `person`, `miles run` (case-insensitive, whitespace trimmed)
3. **Miles**: Must be numeric and >= 0
4. **Person Names**: Cannot be empty (whitespace-only names are rejected)
5. **Data Normalization**: Dates are normalized to JavaScript Date objects, miles to numbers
6. **Multiple Entries**: Multiple runs per day/person are aggregated in time series charts

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Git**: For cloning the repository

## Setup

### Install

```bash
npm install
```

This installs all required dependencies including Next.js 16.0.2, React 19.2.0, TypeScript 5, Recharts 3.4.1, PapaParse 5.5.3, dayjs 1.11.19, and shadcn/ui components.

### Environment Variables

This project does not require any environment variables or `.env` file. All functionality works out of the box without configuration.

### Seed Data

A sample CSV file is provided at `public/sample_running_data.csv`. You can:
- Download it directly from the application's empty state using the "Download Sample CSV" button
- Use it to test the application
- Create your own CSV with the required format

**Required CSV Format:**
- Headers: `date`, `person`, `miles run` (exact order, case-insensitive)
- Date: One of `YYYY-MM-DD`, `MM/DD/YYYY`, or `DD-MM-YYYY`
- Person: Non-empty string
- Miles run: Numeric value >= 0

Example:
```csv
date,person,miles run
2024-01-15,John Smith,5.2
2024-01-17,Jane Doe,3.8
2024-01-18,John Smith,4.5
```

## Run & Verify

### Start Development Server

```bash
npm run dev
```

The application starts at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Test Credentials and Verification Steps

#### 1. Sample CSV & Instructions
- Start the application and visit `http://localhost:3000`
- You should see the empty state with instructions
- Click "Download Sample CSV" button
- Verify the file downloads with name `sample_running_data.csv`
- Open the file to verify it contains valid data in the correct format

#### 2. Overall and Per-Person Charts/Views
- Upload the sample CSV file using the file input
- **Overall Metrics Cards**: Verify 5 cards display - Total Miles, Total Runs, Average Miles/Run, Min Miles, Max Miles
- **Per-Person Table**: Verify table shows metrics for each person with columns: Person, Total Miles, Run Count, Average Miles, Min Miles, Max Miles
- **Line Chart**: Verify "Miles Over Time" chart displays with date on X-axis and miles on Y-axis. Multiple lines should appear if multiple people exist.
- **Bar Charts**: Verify "Total Miles by Person" and "Average Miles per Run" bar charts display correctly
- Use the "Filter by Person" dropdown to select a specific person and verify charts update to show only that person's data

#### 3. Metrics Computed Correctly
- Upload a CSV file with known data
- **Overall Metrics Verification**:
  - Total Miles: Manually sum all miles in CSV, should match displayed value
  - Total Runs: Count rows in CSV (excluding header), should match displayed value
  - Average: Divide Total Miles by Total Runs, should match displayed value
  - Min: Find minimum miles value in CSV, should match displayed value
  - Max: Find maximum miles value in CSV, should match displayed value
- **Per-Person Metrics Verification**:
  - For each person, verify Total Miles is sum of their miles
  - Verify Run Count matches number of entries per person
  - Verify Average is Total Miles / Run Count for each person
  - Verify Min/Max are correct per person

#### 4. Error Handling for Invalid CSV
- Upload a CSV with invalid headers (e.g., `date,name,distance`) - should show error: "Invalid headers. Expected: date, person, miles run"
- Upload a CSV with invalid date format (e.g., `2024/01/15`) - should show row-level errors with accepted formats
- Upload a CSV with empty person field - should show "Person cannot be empty" error for that row
- Upload a CSV with negative miles or non-numeric miles - should show "Miles must be a number >= 0" error
- Upload a non-CSV file (e.g., .txt) - should show "Please upload a valid CSV file" error
- Verify that valid rows are still processed while invalid rows are skipped with error messages displayed

## Features & Limitations

### Features

**CSV Parsing & Validation**
- Real-time CSV parsing with PapaParse
- Header validation (must match exactly)
- Row-level validation (date, person, miles)
- Detailed error reporting per row

**Data Normalization**
- Date format normalization (3 formats supported)
- Type conversion (strings to Date objects, numbers)
- Data cleaning (trimmed names)

**Metrics Calculation**
- Overall: Total, Average, Min, Max
- Per-person: Total, Count, Average, Min, Max
- Real-time calculation on data changes

**Visualizations**
- Line chart: Miles over time (multiple people support)
- Bar chart: Total miles by person
- Bar chart: Average miles by person
- Person filter dropdown
- Responsive chart layouts

**UI/UX**
- Empty state with sample CSV download
- Loading state with spinner
- Error states with detailed messages
- Responsive design (mobile-friendly)
- Accessible components (ARIA labels, keyboard navigation)

### Known Limitations

- Date range filter not implemented
- Cannot export metrics or charts
- Very large CSV files (>10,000 rows) may cause performance issues
- No data persistence (data resets on refresh)
- Only 3 date formats supported

### Future Improvements

- Date range picker for charts
- Export functionality for metrics and charts
- Data persistence using localStorage
- Additional chart types (pie chart for distribution)
- Table sorting and filtering
- Dark mode toggle
- Multi-file upload support

## Notes on Architecture

### Folder Structure

```
csv_runner/
├── app/
│   ├── page.tsx           # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ChartView.tsx      # Charts component (line, bar charts)
│   ├── FileUploader.tsx   # CSV upload & validation UI
│   ├── RawTable.tsx       # Raw data table display
│   └── ui/
│       └── alert.tsx      # Alert component (shadcn/ui)
├── lib/
│   ├── csvValidation.ts   # CSV header/row validation logic
│   ├── csvNormalization.ts # Data normalization (date, types)
│   ├── metrics.ts         # Metrics calculation (avg, min, max)
│   └── utils.ts           # Utility functions
└── public/
    └── sample_running_data.csv  # Sample CSV file
```

### Key Components

**FileUploader** (`components/FileUploader.tsx`)
- Handles file upload and CSV parsing using PapaParse
- Validates headers and rows using validation logic
- Normalizes data using normalization functions
- Shows loading and error states
- Props: `onDataParsed`, `onLoadingChange`, `onValidationErrors`

**ChartView** (`components/ChartView.tsx`)
- Displays interactive charts using Recharts library
- Line chart for time series data with date aggregation
- Bar charts for aggregated metrics (total and average)
- Person filter dropdown for focused views
- Responsive container management for different screen sizes

**Metrics Calculation** (`lib/metrics.ts`)
- `calculateMetrics()`: Main function that computes all metrics
- Returns `DashboardMetrics` interface with overall and per-person stats
- Handles empty data edge cases

### Data Flow

```
CSV Upload → Parse → Validate → Normalize → Calculate Metrics → Display
   ↓           ↓        ↓          ↓              ↓                ↓
PapaParse  Headers  Row Errors  Date/Numbers  Aggregation   Charts/Table
```

### State Management

**Page Level** (`app/page.tsx`):
- `parsedData`: Normalized CSV data array
- `metrics`: Calculated metrics object
- `isLoading`: Loading state boolean

**Component Level**:
- FileUploader: File state, errors, validation state
- ChartView: Selected person filter state

### Data Models

**Normalized Row** (`lib/csvNormalization.ts`):
```typescript
{
  date: Date;      // Normalized Date object
  person: string;  // Trimmed string
  milesRun: number // Parsed number
}
```

**Dashboard Metrics** (`lib/metrics.ts`):
```typescript
{
  totalMiles: number;
  totalRuns: number;
  averageMilesPerRun: number;
  minMiles: number;
  maxMiles: number;
  runByPerson: PersonMetrics[];
}
```

## Accessibility & UI

### Accessibility

**ARIA Labels**
- All interactive elements have `aria-label` attributes
- Charts have `role="img"` with descriptive `aria-label`
- File input has descriptive label
- Filter dropdown has proper labeling

**Keyboard Navigation**
- All interactive elements are keyboard accessible
- File input is focusable with Tab key
- Dropdown can be navigated with keyboard arrows
- Focus styles visible using `focus:ring-2 focus:ring-ring`

**Screen Reader Support**
- Semantic HTML elements (table, button, label)
- Proper heading hierarchy
- Descriptive labels for all interactive elements

### UI Design

**Contrast**
- Text colors use CSS variables for consistent contrast
- Charts use high-contrast colors for visibility
- Tooltip text uses foreground color for readability

**Spacing**
- Consistent spacing using Tailwind's spacing scale
- Cards use padding `p-4` and `p-6`
- Grids use gap `gap-4` and `gap-6`
- Sections use margin `space-y-6`

**Typography**
- Headings use `text-2xl`, `text-3xl`, `text-lg` with `font-bold` or `font-semibold`
- Body text uses `text-sm`
- Metric values use `text-2xl font-bold` for emphasis
- Labels use `text-muted-foreground`

**Responsive Design**
- Mobile-first approach
- Grid layouts: `grid-cols-1 md:grid-cols-3 lg:grid-cols-5`
- Charts use ResponsiveContainer to adapt to screen size
- Tables use horizontal scroll on mobile with `overflow-x-auto`

**Visual Feedback**
- Hover states on table rows: `hover:bg-muted/50`
- Loading spinner with animation
- Error states with red/destructive colors
- Success states with proper visual indicators


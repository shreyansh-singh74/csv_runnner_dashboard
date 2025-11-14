# CSV Runner Dashboard

A Next.js dashboard application for visualizing and analyzing running data from CSV files. Upload CSV files containing running records (date, person, miles run) and explore comprehensive metrics and interactive charts.

## Project Overview

This project implements a **CSV Runner Dashboard** challenge that allows users to:
- Upload and parse CSV files with running data
- Validate CSV headers and data types
- Visualize data through multiple chart types (line charts, bar charts)
- Calculate and display metrics: total, average, min, max (overall and per-person)
- Filter charts by person
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
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For cloning the repository

## Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Next.js 16.0.2
- React 19.2.0
- TypeScript 5
- Recharts 3.4.1
- PapaParse 5.5.3
- dayjs 1.11.19
- shadcn/ui components

### 2. Environment Variables

This project does **not require** any environment variables or `.env` file. All functionality works out of the box without configuration.

### 3. Seed Data (Optional)

A sample CSV file is provided at `public/sample_running_data.csv`. You can:
- Download it directly from the application's empty state
- Use it to test the application
- Or create your own CSV with the format:

```csv
date,person,miles run
2024-01-15,John Smith,5.2
2024-01-17,Jane Doe,3.8
2024-01-18,John Smith,4.5
```

**Required CSV Format:**
- Headers: `date`, `person`, `miles run` (exact order)
- Date: One of `YYYY-MM-DD`, `MM/DD/YYYY`, or `DD-MM-YYYY`
- Person: Non-empty string
- Miles run: Numeric value >= 0

## Run & Verify

### Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Verify Acceptance Criteria

#### 1. Sample CSV & Instructions ✅
- Visit the app in empty state
- Click "Download Sample CSV" button
- Verify sample CSV downloads with correct format

#### 2. Overall and Per-Person Charts/Views ✅
- Upload CSV file
- **Overall Metrics Cards**: Total Miles, Total Runs, Average, Min, Max
- **Per-Person Table**: Shows metrics for each person
- **Line Chart**: Miles over time (multiple lines for multiple people)
- **Bar Charts**: Total Miles and Average Miles by person
- Use person filter dropdown to view single-person charts

#### 3. Metrics Computed Correctly ✅
- **Overall Metrics**:
  - Total Miles: Sum of all miles
  - Total Runs: Count of all rows
  - Average: Total Miles / Total Runs
  - Min: Minimum miles in a single run
  - Max: Maximum miles in a single run
- **Per-Person Metrics**:
  - Total Miles: Sum per person
  - Run Count: Number of runs per person
  - Average: Total Miles / Run Count per person
  - Min: Minimum miles per person
  - Max: Maximum miles per person

#### 4. Error Handling for Invalid CSV ✅
- **Invalid Headers**: Shows error "Invalid headers. Expected: date, person, miles run"
- **Invalid Date Format**: Shows row-level errors with accepted formats
- **Empty Person**: Shows "Person cannot be empty" error
- **Invalid Miles**: Shows "Miles must be a number >= 0" error
- **File Type**: Only accepts `.csv` files
- Valid rows are processed; invalid rows are skipped with error messages

## Features & Limitations

### Features

✅ **CSV Parsing & Validation**
- Real-time CSV parsing with PapaParse
- Header validation (must match exactly)
- Row-level validation (date, person, miles)
- Detailed error reporting per row

✅ **Data Normalization**
- Date format normalization (3 formats supported)
- Type conversion (strings → Date objects, numbers)
- Data cleaning (trimmed names)

✅ **Metrics Calculation**
- Overall: Total, Average, Min, Max
- Per-person: Total, Count, Average, Min, Max
- Real-time calculation on data changes

✅ **Visualizations**
- Line chart: Miles over time (multiple people support)
- Bar chart: Total miles by person
- Bar chart: Average miles by person
- Person filter dropdown
- Responsive chart layouts

✅ **UI/UX**
- Empty state with sample CSV download
- Loading state with spinner
- Error states with detailed messages
- Responsive design (mobile-friendly)
- Accessible components (ARIA labels, keyboard navigation)

### Known Limitations

- **Date Range Filter**: Not yet implemented (optional improvement)
- **Export Functionality**: Cannot export metrics/charts (future feature)
- **Large Files**: Very large CSV files (>10,000 rows) may cause performance issues
- **Data Persistence**: No localStorage/sessionStorage (data resets on refresh)
- **Date Format**: Only 3 date formats supported (extensible)

### Future Improvements

- Date range picker for charts
- Export metrics as CSV/PDF
- Data persistence (localStorage)
- Additional chart types (pie chart for distribution)
- Sorting/filtering in tables
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

**1. FileUploader (`components/FileUploader.tsx`)**
- Handles file upload and CSV parsing
- Validates headers and rows
- Normalizes data
- Shows loading/error states
- Props: `onDataParsed`, `onLoadingChange`, `onValidationErrors`

**2. ChartView (`components/ChartView.tsx`)**
- Displays interactive charts using Recharts
- Line chart for time series data
- Bar charts for aggregated metrics
- Person filter dropdown
- Responsive container management

**3. Metrics Calculation (`lib/metrics.ts`)**
- `calculateMetrics()`: Main function that computes all metrics
- Returns `DashboardMetrics` with overall and per-person stats
- Handles empty data edge cases

**4. Data Flow**
```
CSV Upload → Parse → Validate → Normalize → Calculate Metrics → Display
   ↓           ↓        ↓          ↓              ↓                ↓
PapaParse  Headers  Row Errors  Date/Numbers  Aggregation   Charts/Table
```

### State Management

- **Page Level** (`app/page.tsx`):
  - `parsedData`: Normalized CSV data
  - `metrics`: Calculated metrics
  - `isLoading`: Loading state

- **Component Level**:
  - FileUploader: File, errors, validation state
  - ChartView: Selected person filter

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

### Accessibility Features

✅ **ARIA Labels**
- All interactive elements have `aria-label` attributes
- Charts have `role="img"` with descriptive `aria-label`
- File input has descriptive label
- Filter dropdown has proper labeling

✅ **Keyboard Navigation**
- All interactive elements are keyboard accessible
- File input is focusable with Tab key
- Dropdown can be navigated with keyboard
- Focus styles visible (`focus:ring-2 focus:ring-ring`)

✅ **Screen Reader Support**
- Semantic HTML elements (`<table>`, `<button>`, `<label>`)
- Proper heading hierarchy
- Alt text for icons via aria-labels

### UI Design Principles

✅ **Contrast**
- Text colors use CSS variables (`--foreground`, `--muted-foreground`)
- Charts use high-contrast colors (bright blues, greens, oranges)
- Tooltip text is black/foreground color for readability
- Background colors provide sufficient contrast

✅ **Spacing**
- Consistent spacing using Tailwind's spacing scale
- Padding: `p-4`, `p-6` for cards
- Gap: `gap-4`, `gap-6` for grids
- Margin: `mb-4`, `space-y-6` for sections

✅ **Typography**
- Headings: `text-2xl`, `text-3xl`, `text-lg` with `font-bold`/`font-semibold`
- Body text: `text-sm` with appropriate font weights
- Metric values: `text-2xl font-bold` for emphasis
- Muted text: `text-muted-foreground` for labels

✅ **Responsive Design**
- Mobile-first approach
- Grid layouts: `grid-cols-1 md:grid-cols-3 lg:grid-cols-5`
- Charts: `ResponsiveContainer` adapts to screen size
- Tables: Horizontal scroll on mobile (`overflow-x-auto`)

✅ **Visual Feedback**
- Hover states: `hover:bg-muted/50` on table rows
- Loading spinner with animation
- Error states with red/destructive colors
- Success states with proper visual indicators

## Testing Checklist

### Manual Testing

- [x] Upload valid CSV → Metrics display correctly
- [x] Upload invalid CSV → Errors shown appropriately
- [x] Filter by person → Charts update correctly
- [x] Empty state → Shows instructions and sample download
- [x] Loading state → Spinner appears during processing
- [x] Mobile layout → Responsive on small screens
- [x] Keyboard navigation → All elements accessible
- [x] Min/Max metrics → Display correctly for overall and per-person

### Browser Testing

Tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created as a challenge submission.

---

**Note**: This project does not use any API keys or sensitive credentials. No `.env` file is required.

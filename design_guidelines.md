# Peso Tracker - Design Guidelines

## Brand Identity

**Purpose**: A personal health companion for tracking weight progression. Users need clarity, trust, and encouragement when viewing their health data.

**Aesthetic Direction**: **Clean & Clinical** - Inspired by medical apps and data dashboards. Emphasis on readability, precision, and trust. Minimal distractions, maximum clarity. Think health-tech meets refined data visualization.

**Memorable Element**: The chart is the hero. The weight progression graph should feel like opening your progress dashboard - immediate, clear, and motivating.

---

## Navigation Architecture

**Type**: Single-page application (no navigation required)

**Screen**: Main Dashboard
- Purpose: Add weight entries, view progression chart, and review history in one unified view
- Layout: Vertical stack with three distinct sections

---

## Screen Specifications

### Main Dashboard

**Layout**:
- Header: Fixed at top, 60px height, semi-transparent with backdrop blur
  - Left: App title "Peso Tracker" (large, bold)
  - Right: Date range filter dropdown (optional)
- Content: Scrollable vertical stack with safe area insets (top: 60px + 24px, bottom: 24px)
  - Section 1: Summary Cards (4-column grid on desktop, 2-column on mobile)
  - Section 2: Weight Entry Form (card with elevation)
  - Section 3: Evolution Chart (full-width card, height: 400px)
  - Section 4: Weight History Table (card with max-height: 500px, scrollable)

**Components**:

1. **Summary Cards** (4 cards in row):
   - Current Weight (large number, unit below)
   - Weight Change (vs previous, with up/down arrow icon, colored red/green)
   - Lowest Weight (period)
   - Highest Weight (period)
   - Each card: 16px padding, rounded corners, subtle shadow

2. **Weight Entry Form**:
   - Two input fields side-by-side on desktop, stacked on mobile
   - Date input (left, with calendar icon)
   - Weight input (right, with "kg" suffix)
   - Submit button below (full-width on mobile, right-aligned on desktop)
   - Edit mode: Same form, submit button changes to "Update" + "Cancel" link beside it
   - Validation errors appear below each field in red text

3. **Evolution Chart**:
   - Line chart with smooth curves
   - X-axis: Dates (formatted as DD/MM)
   - Y-axis: Weight in kg
   - Grid lines: subtle, dashed
   - Data points: circles (6px) on line, with hover tooltip showing exact date + weight
   - Empty state: Placeholder illustration with text "Add your first weight entry to see your progress"

4. **Weight History Table**:
   - Columns: Date (DD/MM/YYYY), Weight (kg), Difference (vs previous)
   - Sortable by date (ascending/descending toggle icon in header)
   - Actions column: Edit (pencil icon) and Delete (trash icon) buttons
   - Rows alternate background colors for readability
   - Empty state: Illustration with "No entries yet. Start tracking your weight today!"

**Visual Feedback**:
- Form inputs: Border highlight on focus (primary color)
- Buttons: Slight scale down (0.98) on press
- Table row: Subtle background color on hover
- Delete action: Confirmation modal with "Are you sure?" message

---

## Color Palette

```
Primary: #4A90E2 (trustworthy blue, used for buttons, highlights, chart line)
Success: #27AE60 (weight loss indicator)
Error: #E74C3C (weight gain indicator, validation errors)
Warning: #F39C12 (neutral change)

Background: #F8FAFB (light blue-gray)
Surface: #FFFFFF (cards, form, table)
Border: #E1E8ED (dividers, input borders)

Text Primary: #2C3E50 (headings, labels)
Text Secondary: #7F8C8D (helper text, table data)
Text Disabled: #BDC3C7
```

---

## Typography

**Font**: Inter (Google Font) - Clinical precision, excellent at small sizes for data tables

**Type Scale**:
- Heading 1 (App Title): 28px, Bold, #2C3E50
- Heading 2 (Section Titles): 20px, SemiBold, #2C3E50
- Card Value (Large Numbers): 32px, Bold, Primary color
- Body (Table, Form): 15px, Regular, #2C3E50
- Caption (Units, Helper Text): 13px, Regular, #7F8C8D

---

## Visual Design

**Icons**: Feather icons from @expo/vector-icons
- Calendar, TrendingUp, TrendingDown, Edit, Trash2, Info

**Elevation**:
- Cards: No shadow by default, rely on subtle borders
- Form on focus: Subtle shadow (0px 2px 8px rgba(0,0,0,0.08))
- Buttons: No shadow

**Spacing System** (8px base):
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

**Border Radius**: 8px for all cards and inputs

---

## Assets to Generate

1. **empty-chart.png** - Minimalist illustration showing an empty line graph with a dotted upward trend
   - WHERE USED: Chart section when no data exists

2. **empty-table.png** - Simple illustration of a clipboard with checkmarks
   - WHERE USED: Table section when no entries exist

3. **icon.png** - App icon featuring a simple scale icon with upward arrow
   - WHERE USED: Browser tab favicon, PWA icon

**Asset Style**: Line-art illustrations in primary blue (#4A90E2) on transparent background, simple and clean
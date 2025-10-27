# Dashboard Module

This directory contains the modular dashboard implementation for PayTriox.

## Structure

```
dashboard/
├── _components/           # Dashboard-specific components
│   ├── widgets/          # Reusable widget components
│   │   ├── WalletBalance.tsx
│   │   ├── TotalEmployees.tsx
│   │   ├── ActiveEmployees.tsx
│   │   ├── PendingRequest.tsx
│   │   ├── RecentActivity.tsx
│   │   └── index.ts      # Widget exports
│   └── DashboardContent.tsx  # Main dashboard layout
├── _hooks/               # Dashboard-specific hooks
│   └── useDashboardData.ts   # Data fetching hook
├── _types/               # Type definitions
│   └── index.ts
├── _utils/               # Utility functions (if needed)
└── page.tsx              # Dashboard route page
```

## Design Principles

### 1. **Modular Architecture**
- Each widget is self-contained and reusable
- Clear separation of concerns (components, hooks, types, utils)
- Feature-based organization using Next.js 13+ conventions

### 2. **Type Safety**
- Centralized type definitions in `_types/index.ts`
- Proper TypeScript interfaces for all components and data structures

### 3. **Custom Hooks**
- `useDashboardData`: Handles authentication and data fetching
- Encapsulates complex logic away from UI components
- Reusable across different dashboard views

### 4. **Code Organization**
- Prefix with underscore (`_`) to indicate module-private directories
- Named exports for better tree-shaking
- Barrel exports (index.ts) for cleaner imports

## Component Hierarchy

```
page.tsx
  └── DashboardContent
      ├── WalletBalance
      ├── TotalEmployees
      ├── ActiveEmployees
      ├── LiveLineChart (from shared components)
      ├── RecentActivityWidget
      ├── PendingRequest
      └── PendingPayrollVolume
```

## Usage

### Importing Widgets

```tsx
// Import all widgets
import {
  WalletBalance,
  TotalEmployees,
  ActiveEmployees,
  PendingRequest,
  PendingPayrollVolume,
  RecentActivityWidget
} from './_components/widgets';

// Or import individually
import { WalletBalance } from './_components/widgets/WalletBalance';
```

### Using the Dashboard Hook

```tsx
import { useDashboardData } from './_hooks/useDashboardData';

function MyComponent() {
  const { data, loading } = useDashboardData();
  
  if (loading) return <LoadingSpinner />;
  
  return <div>{data?.totalEmployees}</div>;
}
```

## Widget Components

### WalletBalance
Displays the organization's treasury wallet balance in USDT/USDC.

**Props:** None (uses hooks internally)

### TotalEmployees
Shows the total number of employees/recipients.

**Props:**
- `totalEmployees: number` - Count of employees

### ActiveEmployees
Displays active employee count with a performance percentage indicator.

**Props:**
- `activeEmployees: number` - Count of active employees
- `performancePercentage: number` - Performance metric (0-100)

### PendingRequest
Shows pending salary advancement requests.

**Props:**
- `count: number` - Number of pending requests

### PendingPayrollVolume
Displays the total pending payroll volume in USDT.

**Props:**
- `volume: number` - Pending volume amount

### RecentActivityWidget
Lists recent activity notifications.

**Props:**
- `activities: RecentActivity[]` - Array of activity items

## Data Flow

1. **Page Load** → `page.tsx` renders `DashboardContent`
2. **Authentication** → `useWalletRedirect` ensures user is connected
3. **Data Fetch** → `useDashboardData` hook:
   - Checks wallet connection
   - Authenticates with backend (if needed)
   - Fetches organization and notification data
   - Transforms data to dashboard format
4. **Render** → Dashboard widgets receive data as props

## Adding New Widgets

1. Create widget component in `_components/widgets/`:
```tsx
// _components/widgets/MyWidget.tsx
export function MyWidget({ data }: { data: string }) {
  return <div>{data}</div>;
}
```

2. Export from widgets index:
```tsx
// _components/widgets/index.ts
export { MyWidget } from './MyWidget';
```

3. Add to DashboardContent:
```tsx
import { MyWidget } from './widgets';

// In render:
<MyWidget data={data?.someField} />
```

## Best Practices

1. **Keep widgets pure** - Avoid side effects in widgets, use hooks instead
2. **Centralize data fetching** - Use the `useDashboardData` hook
3. **Type everything** - Add types to `_types/index.ts`
4. **Error handling** - Handle loading and error states gracefully
5. **Responsive design** - Use Tailwind's responsive classes (md:, lg:)

## Performance Considerations

- **Dynamic imports** - LiveLineChart is loaded dynamically to reduce initial bundle
- **Memoization** - Consider using React.memo for expensive widgets
- **Data caching** - Dashboard data is fetched once per session
- **Lazy loading** - Non-critical widgets can be code-split

## Future Improvements

- [ ] Add unit tests for widgets
- [ ] Implement real-time updates via WebSocket
- [ ] Add dashboard customization (drag & drop widgets)
- [ ] Create widget library for other pages
- [ ] Add more chart types
- [ ] Implement data export functionality

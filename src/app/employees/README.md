# Employees Module

This directory contains the modular employees/recipients management implementation for PayTriox.

## Structure

```
employees/
├── _components/           # Employee-specific components
│   ├── widgets/          # Reusable widget components
│   │   ├── TreasuryBalance.tsx
│   │   ├── ActiveEmployeesCard.tsx
│   │   ├── LeaveRequestsCard.tsx
│   │   └── index.ts      # Widget exports
│   ├── EmployeesTable.tsx    # Main table component
│   └── EmployeesContent.tsx  # Main layout
├── _hooks/               # Employee-specific hooks
│   ├── useEmployeesData.ts   # Data fetching hook
│   └── index.ts
├── _types/               # Type definitions
│   └── index.ts
├── _utils/               # Utility functions
│   └── index.ts
└── page.tsx              # Employees route page
```

## Design Principles

### 1. **Modular Architecture**
- Each widget is self-contained and reusable
- Clear separation of concerns (components, hooks, types, utils)
- Feature-based organization using Next.js 13+ conventions

### 2. **Type Safety**
- Centralized type definitions in `_types/index.ts`
- Proper TypeScript interfaces for all components and data structures
- API types separate from UI types

### 3. **Custom Hooks**
- `useEmployeesData`: Handles authentication, data fetching, and CRUD operations
- Encapsulates complex logic away from UI components
- Provides refetch and removeEmployee methods

### 4. **Utility Functions**
- Data transformation utilities
- Status color helpers
- Progress calculation functions
- Isolated from components for testability

## Component Hierarchy

```
page.tsx
  └── EmployeesContent
      ├── TreasuryBalance
      ├── ActiveEmployeesCard
      ├── LeaveRequestsCard
      ├── EmployeesTable
      └── CreateRecipient (modal)
```

## Usage

### Importing Components

```tsx
// Import widgets
import {
  TreasuryBalance,
  ActiveEmployeesCard,
  LeaveRequestsCard
} from './_components/widgets';

// Import main components
import { EmployeesContent } from './_components/EmployeesContent';
import { EmployeesTable } from './_components/EmployeesTable';
```

### Using the Employees Hook

```tsx
import { useEmployeesData } from './_hooks';

function MyComponent() {
  const { data, loading, refetch, removeEmployee } = useEmployeesData();
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      <p>Total: {data?.stats.totalEmployees}</p>
      <button onClick={() => removeEmployee(employeeId)}>Remove</button>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Using Utility Functions

```tsx
import { 
  getStatusColorClass, 
  getInitials, 
  transformRecipient 
} from './_utils';

// Get color for status
const colorClass = getStatusColorClass('active'); // 'text-green-500'

// Get user initials
const initials = getInitials('John Doe'); // 'JD'

// Transform API data
const uiRecipient = transformRecipient(apiRecipient);
```

## Widget Components

### TreasuryBalance
Displays the organization's treasury wallet balance.

**Props:**
- `balance: string` - Balance amount
- `isLoading: boolean` - Loading state

### ActiveEmployeesCard
Shows active employee count with circular progress indicator.

**Props:**
- `activeEmployees: number` - Count of active employees
- `totalEmployees: number` - Total employee count

### LeaveRequestsCard
Displays pending leave requests with link to leave management.

**Props:**
- `count: number` - Number of pending requests

### EmployeesTable
Lists all employees in a table with CRUD operations.

**Props:**
- `employees: Recipient[]` - Array of employees
- `onRemove: (id: number) => void` - Remove callback
- `onAddClick: () => void` - Add button callback

## Data Flow

1. **Page Load** → `page.tsx` renders `EmployeesContent`
2. **Authentication** → `useWalletRedirect` ensures user is connected
3. **Data Fetch** → `useEmployeesData` hook:
   - Checks wallet connection
   - Authenticates with backend (if needed)
   - Fetches organization profiles
   - Fetches leave requests
   - Transforms data using utilities
   - Returns data and methods
4. **Render** → Components receive data as props
5. **Actions** → removeEmployee triggers optimistic updates

## Types

### RecipientProfile (API)
```typescript
interface RecipientProfile {
  id: number;
  name: string;
  email: string;
  recipient_ethereum_address: string;
  organization: number;
  phone_number: string;
  salary: number;
  position: string;
  status: string;
  created_at: string;
  updated_at: string;
}
```

### Recipient (UI)
```typescript
interface Recipient {
  id: number;
  name: string;
  position: string;
  wallet: string;      // Truncated address
  salary: string;      // Formatted with currency
  status: string;
}
```

### EmployeesStats
```typescript
interface EmployeesStats {
  totalEmployees: number;
  activeEmployees: number;
  leaveRequests: number;
  treasuryBalance: string;
}
```

## Utilities

### `transformRecipient()`
Converts API `RecipientProfile` to UI `Recipient` format.
- Truncates wallet address
- Formats salary with currency
- Provides defaults for missing data

### `getStatusColorClass()`
Returns Tailwind CSS class for status badge:
- `'active'` → `'text-green-500'`
- `'on leave'` → `'text-yellow-500'`
- Other → `'text-gray-500'`

### `calculateStrokeDashoffset()`
Calculates SVG stroke offset for circular progress:
- Returns string value for SVG strokeDashoffset
- Handles edge cases (0 employees, etc.)

### `getInitials()`
Extracts initials from full name:
- `'John Doe'` → `'JD'`
- Handles multi-word names
- Uppercase result

## CRUD Operations

### Fetch Employees
```tsx
const { data, loading, refetch } = useEmployeesData();
```

### Remove Employee
```tsx
const { removeEmployee } = useEmployeesData();

// Optimistically updates UI before API call
await removeEmployee(employeeId);
```

### Add Employee
```tsx
// Modal opens CreateRecipient component
const [showModal, setShowModal] = useState(false);

const handleSuccess = () => {
  setShowModal(false);
  refetch(); // Refresh data
};

<CreateRecipient 
  onClose={() => setShowModal(false)}
  onSuccess={handleSuccess}
/>
```

## Best Practices

1. **Optimistic Updates** - UI updates immediately, rollback on error
2. **Error Handling** - Toast notifications for user feedback
3. **Type Safety** - All data properly typed
4. **Loading States** - Show spinners during operations
5. **Responsive Design** - Mobile-first approach with Tailwind
6. **Utility Functions** - Extract reusable logic

## Performance Considerations

- **Optimistic Updates** - Instant UI feedback
- **Data Transformation** - Done in hook, not in components
- **Memoization** - Callbacks use useCallback
- **Conditional Rendering** - Early returns for loading states

## Future Enhancements

- [ ] Add unit tests for utilities
- [ ] Add employee search/filter
- [ ] Add bulk operations
- [ ] Add employee details modal
- [ ] Add export to CSV
- [ ] Add pagination for large lists
- [ ] Add sorting by columns
- [ ] Add employee status management

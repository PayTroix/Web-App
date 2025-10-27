# Leave Management Module

> **Purpose**: Employee leave request management and approval system

## 📁 Structure

```
leaveManagement/
├── page.tsx                                # Route entry point
├── _components/
│   ├── index.ts                            # Barrel export
│   ├── LeaveManagementContent.tsx          # Main orchestration component
│   └── widgets/
│       ├── index.ts                        # Widget barrel export
│       ├── LeaveStatsCards.tsx             # Stats display cards
│       └── LeaveRequestsTable.tsx          # Leave requests table
├── _hooks/
│   ├── index.ts                            # Barrel export
│   └── useLeaveManagementData.ts           # Data fetching & CRUD operations
├── _types/
│   └── index.ts                            # TypeScript definitions
└── _utils/
    └── index.ts                            # Utility functions
```

## 🎯 Key Features

- **Leave Request Overview**: View all employee leave requests
- **Statistics Dashboard**: Approved, pending, and declined counts
- **Active Employee Tracking**: Circular progress showing active employees percentage
- **Request Details Modal**: View full request details
- **Approval Workflow**: Approve or decline requests with one click
- **Real-time Updates**: Data refetch after approval/decline actions

## 🔧 Core Components

### LeaveManagementContent (Main Component)
Orchestrates all hooks and widgets:
```tsx
import { LeaveManagementContent } from '@/app/leaveManagement/_components';

// Manages:
// - Leave requests list
// - Modal state for request details
// - Approval/decline actions
```

### Widgets

#### LeaveStatsCards
Displays key leave statistics:
```tsx
<LeaveStatsCards 
  stats={{ 
    approved, 
    pending, 
    declined, 
    totalEmployees, 
    activeEmployeesPercentage 
  }} 
/>
```

**Layout**:
- **Approved Card** (3 cols): Shows approved requests this month
- **Active Employee Card** (1 col): Circular progress with percentage
- **Declined Card** (2 cols): Shows declined request count

#### LeaveRequestsTable
Displays all leave requests:
```tsx
<LeaveRequestsTable
  leaveRequests={requests}
  onViewRequest={(request) => setSelectedRequest(request)}
/>
```

**Columns**:
- Recipient (with avatar/initials)
- Leave Type
- Days (calculated from date range)
- Reason
- Status (color-coded badge)
- Actions (View button)

## 🪝 Hook

### useLeaveManagementData
Manages all leave-related data and operations:
```tsx
const {
  leaveRequests,      // Array<LeaveRequest>
  stats,              // LeaveStats
  loading,            // boolean
  refetch,            // () => Promise<void>
  approveRequest,     // (id: number) => Promise<void>
  declineRequest      // (id: number) => Promise<void>
} = useLeaveManagementData();
```

**Features**:
- Automatic data fetching on mount
- Stats calculation (approved, pending, declined counts)
- Active employee percentage calculation
- Wallet address change detection with redirect
- CRUD operations with toast notifications

## 📊 Types

### Key Interfaces

```typescript
interface LeaveStats {
  approved: number;
  pending: number;
  declined: number;
  totalEmployees: number;
  activeEmployeesPercentage: number;
}

// LeaveRequest imported from @/services/api
// Includes: id, recipient, leave_type, start_date, end_date, 
//           reason, status, created_at, updated_at
```

## 🛠️ Utilities

```typescript
// Calculate days between dates
calculateLeaveDays(startDate: string, endDate: string): number

// Get status badge color
getStatusColorClass(status: string): string

// Capitalize first letter
capitalizeFirst(text: string): string

// Calculate circular progress offset
calculateCircleStrokeDashoffset(percentage: number): number

// Check if employee is currently on leave
isCurrentlyOnLeave(request: LeaveRequest): boolean
```

## 🎨 Styling

- **Dark theme**: Background `#0A0A0A`, cards `#111111`
- **Border**: `#333333` with hover effects
- **Status colors**:
  - Approved: Green (#10B981)
  - Pending: Yellow (#F59E0B)
  - Declined: Red (#EF4444)
- **Icons**: 
  - CheckCircle for approved (blue background)
  - X for declined (red background)
- **Blur effect**: Applied to background when modal is open

## 🔄 Data Flow

```
User Action (View Request)
         ↓
setSelectedRequest(request)
         ↓
LeaveRequestModal opens
         ↓
User approves/declines
         ↓
approveRequest() or declineRequest()
         ↓
API call → Toast notification
         ↓
refetch() → Updated data
         ↓
Modal closes
```

## 🚀 Usage Example

```tsx
// In page.tsx
import Layout from "@/components/Sidebar";
import { LeaveManagementContent } from "./_components";

export default function LeaveManagement() {
  return (
    <Layout>
      <LeaveManagementContent />
    </Layout>
  );
}
```

## 📦 Dependencies

- **wagmi**: Wallet address tracking
- **date-fns**: Date calculations (differenceInDays, format)
- **lucide-react**: Icons (ArrowLeft, CheckCircle, X)
- **react-hot-toast**: User notifications
- **next/image**: Optimized avatar images
- **@/services/api**: Leave request API service

## 🔐 Security Features

- Wallet address change detection
- Token validation before API calls
- Auto-redirect on wallet disconnect
- Token removal on address change

## 📈 Metrics

- **Original**: 296 lines (monolith)
- **Refactored**: ~350 lines across 8 files
- **Type Coverage**: 100%
- **Components**: 1 main + 2 widgets
- **Hooks**: 1 custom hook
- **Utilities**: 5 utility functions

## 🐛 Error Handling

All errors are:
1. Caught in try-catch blocks
2. Logged to console with context
3. Displayed via toast notifications
4. Data refetch triggered after successful actions

## 🔮 Future Enhancements

- [ ] Leave request filtering (by status, date range)
- [ ] Leave type management
- [ ] Leave balance tracking per employee
- [ ] Calendar view of leave schedules
- [ ] Export leave reports (CSV/PDF)
- [ ] Email notifications on approval/decline
- [ ] Leave request comments/notes
- [ ] Bulk approval/decline actions

---

**Last Updated**: January 2025  
**Module Status**: ✅ Complete  
**Migration Status**: Fully migrated from monolith

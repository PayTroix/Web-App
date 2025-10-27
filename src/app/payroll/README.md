# Payroll Module

> **Purpose**: Salary disbursement and payroll management with blockchain integration

## 📁 Structure

```
payroll/
├── page.tsx                          # Route entry point
├── _components/
│   ├── index.ts                      # Barrel export
│   ├── PayrollContent.tsx            # Main orchestration component
│   └── widgets/
│       ├── index.ts                  # Widget barrel export
│       ├── PayrollSummaryCards.tsx   # Stats display cards
│       ├── DisbursementForm.tsx      # Payment form with month picker
│       └── RecentPaymentsTable.tsx   # Payment history table
├── _hooks/
│   ├── index.ts                      # Barrel export
│   ├── usePayrollData.ts             # Data fetching & state management
│   └── usePayrollDisbursement.ts     # Blockchain disbursement logic
├── _types/
│   └── index.ts                      # TypeScript definitions
├── _utils/
│   └── index.ts                      # Utility functions
└── _constants/
    └── index.ts                      # Module constants
```

## 🎯 Key Features

- **Salary Disbursement**: Blockchain-based payroll with token selection (USDT/USDC)
- **Group Management**: Filter by active/inactive/all employee groups
- **Payment History**: Recent disbursements with status tracking
- **Month Picker**: Custom calendar UI for selecting payment periods
- **Token Approval**: Automatic ERC-20 token approval workflow
- **Balance Validation**: Real-time balance checks before disbursement

## 🔧 Core Components

### PayrollContent (Main Component)
Orchestrates all hooks and widgets:
```tsx
import { PayrollContent } from '@/app/payroll/_components';

// Manages:
// - State for selected group, token, month, year
// - Disbursement flow with toast notifications
// - Data refetch after successful payment
```

### Widgets

#### PayrollSummaryCards
Displays key metrics:
```tsx
<PayrollSummaryCards
  stats={{ walletBalance, totalEmployees, totalPayroll }}
  balance="1000.00"
  isLoadingBalance={false}
  selectedToken="USDT"
/>
```

#### DisbursementForm
Complex form with month picker:
```tsx
<DisbursementForm
  selectedGroup="active"
  onGroupChange={setSelectedGroup}
  selectedToken="USDT"
  onTokenChange={setSelectedToken}
  paymentMonth="January"
  onMonthChange={setPaymentMonth}
  selectedYear={2024}
  onYearChange={setSelectedYear}
  totalAmount={5000}
  onDisburse={handleDisbursement}
  isDisbursing={false}
/>
```

#### RecentPaymentsTable
Payment history display:
```tsx
<RecentPaymentsTable employees={employeesArray} />
```

## 🪝 Hooks

### usePayrollData
Fetches and manages all payroll data:
```tsx
const {
  employees,          // Array<Employee>
  recipients,         // Array<Recipient>
  stats,              // PayrollStats
  loading,            // boolean
  isDisbursing,       // boolean
  setIsDisbursing,    // Setter
  balances,           // { USDT: string, USDC: string, loading: boolean }
  refetch,            // (token: SupportedToken) => Promise<void>
  getGroupTotalAmount,// (group: RecipientGroup) => number
  getFilteredRecipients // (group: RecipientGroup) => Recipient[]
} = usePayrollData();
```

### usePayrollDisbursement
Handles blockchain disbursement:
```tsx
const { disburse } = usePayrollDisbursement({
  recipients,
  onSuccess: () => refetch('USDT')
});

// Usage:
await disburse('active', 'January 2024', 'USDT');
```

**Disbursement Flow**:
1. Filter recipients by group
2. Validate recipients exist
3. Check contract deployment
4. Get wallet client
5. Check token balance
6. Approve token spending (if needed)
7. Execute batch transfer
8. Call onSuccess callback

## 📊 Types

### Key Interfaces

```typescript
interface Employee {
  id: number;
  recipient_address: string;
  monthly_salary: string;
  payment_date: string;
  payment_status: 'paid' | 'pending' | 'failed';
}

interface Recipient {
  id: number;
  name: string;
  address: string;
  salary: string;
  group: RecipientGroup;
}

interface PayrollStats {
  walletBalance: string;
  totalEmployees: number;
  totalPayroll: number;
}

type RecipientGroup = 'all' | 'active' | 'inactive';
type SupportedToken = 'USDT' | 'USDC';
```

## 🛠️ Utilities

```typescript
// Currency formatting
formatCurrency(value: number | string): string

// Transform recipient to employee format
transformRecipientToEmployee(recipient: Recipient): Employee

// Calculate total for recipients
calculateTotalAmount(recipients: Recipient[]): number

// Filter recipients by group
filterRecipientsByGroup(
  recipients: Recipient[], 
  group: RecipientGroup
): Recipient[]

// Validate recipients array
validateRecipients(recipients: Recipient[]): void

// Get status CSS class
getStatusClass(status: string): string
```

## 🔐 Constants

```typescript
// Supported tokens with contract addresses
SUPPORTED_TOKENS = {
  USDT: { address: '0x...', symbol: 'USDT', decimals: 6 },
  USDC: { address: '0x...', symbol: 'USDC', decimals: 6 }
}

// Month names
MONTHS = ['January', 'February', ..., 'December']

// Tailwind transition classes
TRANSITION_CLASSES = 'transition-colors duration-200'

// USDT decimals constant
USDT_DECIMALS = 6
```

## 🎨 Styling

All components use Tailwind CSS with:
- Glass morphism effects on cards
- Hover states with color transitions
- Responsive grid layouts (mobile → desktop)
- Custom month picker with year navigation
- Status badges with color coding

## 🔄 State Management

State flows:
1. **Data Loading**: `usePayrollData` → fetch employees & recipients
2. **Form State**: Local state in `PayrollContent` → passed to widgets
3. **Disbursement**: User action → `usePayrollDisbursement` → blockchain → refetch
4. **Toast Notifications**: All user feedback via react-hot-toast

## 🚀 Usage Example

```tsx
// In page.tsx
import Layout from "@/components/Sidebar";
import { PayrollContent } from "./_components";

export default function Payroll() {
  return (
    <Layout>
      <PayrollContent />
    </Layout>
  );
}
```

## 📦 Dependencies

- **wagmi**: Wallet connection, contract hooks
- **viem**: Contract interactions, formatting
- **ethers.js**: Contract deployment, token operations
- **react-hot-toast**: User notifications
- **@/services/api**: API calls for employees/recipients
- **@/utils/tokenUtils**: Contract ABI imports

## 🐛 Error Handling

All errors are:
1. Caught in try-catch blocks
2. Logged to console with context
3. Displayed to user via toast notifications
4. Reset loading states in finally blocks

## 📈 Metrics

- **Original**: 948 lines (monolith)
- **Refactored**: ~700 lines across 10 files
- **Line Savings**: ~250 lines (26% reduction)
- **Type Coverage**: 100%
- **Components**: 1 main + 3 widgets
- **Hooks**: 2 custom hooks
- **Utilities**: 6 utility functions

## 🔮 Future Enhancements

- [ ] Payment history view with filtering
- [ ] CSV export for payroll records
- [ ] Recurring payment scheduling
- [ ] Multi-token batch payments
- [ ] Payment approval workflow
- [ ] Payroll analytics dashboard

---

**Last Updated**: January 2025  
**Module Status**: ✅ Complete  
**Migration Status**: Fully migrated from monolith

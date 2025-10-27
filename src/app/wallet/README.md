# Wallet Module

> **Purpose**: Recipient wallet dashboard with balance, summaries, and transaction history

## 📁 Structure

```
wallet/
├── page.tsx                              # Route entry point
├── _components/
│   ├── index.ts                          # Barrel export
│   ├── WalletContent.tsx                 # Main wallet dashboard
│   └── widgets/
│       ├── index.ts                      # Widget barrel export
│       ├── BalanceCard.tsx               # Wallet balance display
│       ├── MonthlySummaryCards.tsx       # Monthly income/expense cards
│       └── TransactionHistoryTable.tsx   # Transaction history table
├── _types/
│   └── index.ts                          # TypeScript definitions
└── _constants/
    └── index.ts                          # Mock data and constants
```

## 🎯 Key Features

- **Wallet Balance**: Current balance display in USDT
- **Monthly Summaries**: Income and expense overview for recent months
- **Transaction History**: Detailed transaction log with status tracking
- **Salary Advance Link**: Quick access to salary advance feature
- **Status Color Coding**: Visual distinction for pending/completed/failed transactions

## 🔧 Core Components

### WalletContent (Main Component)
Wallet dashboard orchestration:
```tsx
import { WalletContent } from '@/app/wallet/_components';

// Displays:
// - Balance card
// - Monthly summary cards (3 months)
// - Transaction history table
```

### Widgets

#### BalanceCard
Displays current wallet balance:
```tsx
<BalanceCard balance={16000} />
```

**Features**:
- Large balance display
- Currency indicator (USDT)
- Wallet icon with hover effect

#### MonthlySummaryCards
Monthly income/expense summaries:
```tsx
<MonthlySummaryCards summaries={MONTHLY_SUMMARIES} />
```

**Each card shows**:
- Month and year
- Visual gradient bar
- Income (green, positive)
- Expense (red, negative)

#### TransactionHistoryTable
Transaction list with details:
```tsx
<TransactionHistoryTable transactions={TRANSACTION_HISTORY} />
```

**Columns**:
- Date
- Type (Salary Credit, Withdrawal, Transfer)
- Amount
- Status (color-coded: pending/completed/failed)
- Transaction ID
- To/From (source/destination)

## 📊 Types

```typescript
interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
}

interface Transaction {
  date: string;
  type: string;
  amount: string;
  status: 'Pending' | 'Completed' | 'Failed';
  id: string;
  tofrom: string;
}

type TransactionStatus = 'Pending' | 'Completed' | 'Failed';
```

## 🔐 Constants

```typescript
// Wallet balance (mock)
WALLET_BALANCE = 16000

// Monthly summaries (mock data for Feb, Mar, April 2025)
MONTHLY_SUMMARIES: MonthlySummary[]

// Transaction history (mock data)
TRANSACTION_HISTORY: Transaction[]

// Status color mapping
STATUS_COLORS = {
  Pending: 'text-yellow-400',
  Completed: 'text-green-400',
  Failed: 'text-red-500'
}
```

## 🎨 Styling

- **Dark theme**: Black background
- **Borders**: `#2C2C2C` with hover blue-500/20
- **Grid layout**: 4 columns on desktop (1 balance + 3 monthly summaries)
- **Monthly cards**: Gradient background from green-400/20 to green-300/10
- **Status colors**:
  - Pending: Yellow (#F59E0B)
  - Completed: Green (#10B981)
  - Failed: Red (#EF4444)
- **Income/Expense**: Green for income (+), Red for expense (-)

## 🔄 Data Flow

```
Page Mount
    ↓
WalletContent
    ↓
Load Constants:
  - WALLET_BALANCE
  - MONTHLY_SUMMARIES
  - TRANSACTION_HISTORY
    ↓
Render Widgets:
  - BalanceCard (balance)
  - MonthlySummaryCards (summaries)
  - TransactionHistoryTable (transactions)
```

## 🚀 Usage Example

```tsx
// In page.tsx
import Layout from '@/components/recipient-components/RecipientSidebar';
import { WalletContent } from './_components';

export default function Dashboard() {
  return (
    <Layout>
      <WalletContent />
    </Layout>
  );
}
```

## 📦 Dependencies

- **lucide-react**: CalendarDays, ChevronRight icons
- **next/image**: Optimized image loading (wallet.png)
- **next/link**: Salary advance navigation
- **@/hooks/useWalletRedirect**: Wallet redirect protection

## 📈 Metrics

- **Original**: 109 lines (static component)
- **Refactored**: ~240 lines across 8 files
- **Line Addition**: +131 lines (better organization, maintainability)
- **Type Coverage**: 100%
- **Components**: 1 main + 3 widgets
- **Mock Data**: Centralized in constants

## 🎯 Current State

**Note**: This module currently uses **mock/static data**. The data is hardcoded for demonstration purposes.

**Mock Data Includes**:
- Static balance: $16,000
- 3 months of summaries (Feb, Mar, April 2025)
- 4 sample transactions

## 🔮 Future Enhancements

- [ ] **Connect to real blockchain data**
  - Integrate with wallet provider (wagmi/viem)
  - Fetch actual balance from smart contracts
  - Real transaction history from blockchain
  
- [ ] **Dynamic monthly summaries**
  - Calculate from actual payroll data
  - Filter by date range
  - Show current month prominently
  
- [ ] **Transaction features**
  - Filter by status, type, date range
  - Search by transaction ID
  - Export transaction history (CSV/PDF)
  - Transaction detail modal
  
- [ ] **Wallet operations**
  - Send/transfer funds
  - Withdraw to bank account
  - Token swap functionality
  - Multi-token support (USDT, USDC, etc.)
  
- [ ] **Analytics**
  - Spending charts/graphs
  - Income trends
  - Budget tracking
  - Financial insights

- [ ] **Notifications**
  - Transaction alerts
  - Low balance warnings
  - Payment reminders

## 📝 Migration Notes

**Current Implementation**:
- Uses mock data from `_constants/index.ts`
- No API calls or blockchain integration
- Static display only

**To Connect Real Data**:
1. Create a `useWalletData` hook in `_hooks/`
2. Fetch balance from blockchain via wagmi/viem
3. Fetch transactions from API or blockchain events
4. Calculate monthly summaries from payroll data
5. Update components to use hook data instead of constants

---

**Last Updated**: January 2025  
**Module Status**: ✅ Complete (with mock data)  
**Migration Status**: Fully migrated from monolith  
**Data Status**: ⚠️ Mock/Static (ready for real data integration)

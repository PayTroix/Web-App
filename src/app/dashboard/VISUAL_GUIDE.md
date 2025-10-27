# Dashboard Module - Visual Guide

## 🎨 Module Structure Visualization

```
dashboard/
│
├── 📄 page.tsx                     ← Entry point (Route Handler)
│
├── 📁 _components/                 ← UI Components
│   │
│   ├── 📄 DashboardContent.tsx    ← Main Layout Component
│   │   └── Imports from widgets/  
│   │
│   └── 📁 widgets/                 ← Reusable Widget Components
│       ├── 📄 index.ts            ← Barrel export
│       ├── 📄 WalletBalance.tsx   ← Treasury balance widget
│       ├── 📄 TotalEmployees.tsx  ← Employee count widget
│       ├── 📄 ActiveEmployees.tsx ← Active employees with %
│       ├── 📄 PendingRequest.tsx  ← Salary advancement requests
│       └── 📄 RecentActivity.tsx  ← Recent notifications
│
├── 📁 _hooks/                      ← Custom React Hooks
│   ├── 📄 index.ts                ← Barrel export
│   └── 📄 useDashboardData.ts     ← Data fetching & auth logic
│
├── 📁 _types/                      ← TypeScript Definitions
│   └── 📄 index.ts                ← All dashboard types
│
├── 📁 _utils/                      ← Helper Functions
│   └── (reserved for future use)
│
└── 📚 Documentation/
    ├── 📄 README.md               ← Module overview
    ├── 📄 ARCHITECTURE.md         ← Technical architecture
    ├── 📄 QUICK_REFERENCE.md      ← Developer cheatsheet
    └── 📄 REFACTORING_SUMMARY.md  ← What changed
```

## 🔄 Component Hierarchy

```
┌─────────────────────────────────────────────┐
│              page.tsx (Route)               │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │  Layout (Sidebar)  │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────────┐
         │  DashboardContent      │
         │  ┌──────────────────┐  │
         │  │ useDashboardData │  │
         │  │ useWalletRedirect│  │
         │  └──────────────────┘  │
         └──┬────────────────────┬┘
            │                    │
    ┌───────▼────────┐    ┌─────▼──────────┐
    │  Summary Row   │    │  Content Row   │
    └───┬─────┬──────┘    └─┬──────┬───────┘
        │     │             │      │
    ┌───▼───┐ │       ┌────▼──┐   │
    │Wallet │ │       │Chart  │   │
    │Balance│ │       │       │   │
    └───────┘ │       └───────┘   │
              │                   │
        ┌─────▼────┐        ┌─────▼────────┐
        │  Total   │        │   Recent     │
        │Employees │        │   Activity   │
        └──────────┘        └──────────────┘
              │
        ┌─────▼────┐
        │  Active  │
        │Employees │
        └──────────┘
```

## 📦 Import/Export Flow

```
┌──────────────────────────────────────┐
│        External Dependencies         │
│  - wagmi (hooks)                     │
│  - next/navigation                   │
│  - react-hot-toast                   │
│  - @/services/api                    │
│  - @/hooks/useWalletRedirect         │
│  - @/utils/token                     │
└──────────────┬───────────────────────┘
               │
        ┌──────▼─────┐
        │  _types/   │
        │  index.ts  │
        └──────┬─────┘
               │ (types)
        ┌──────▼─────────┐
        │    _hooks/     │
        │ useDashboard   │
        │    Data.ts     │
        └──────┬─────────┘
               │ (data)
        ┌──────▼──────────┐
        │   _components/  │
        │    widgets/     │
        │    index.ts     │
        └──────┬──────────┘
               │ (components)
        ┌──────▼──────────┐
        │  Dashboard      │
        │  Content.tsx    │
        └──────┬──────────┘
               │
        ┌──────▼──────┐
        │  page.tsx   │
        └─────────────┘
```

## 🎯 Data Flow Diagram

```
┌─────────┐
│  User   │
│ Action  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│   page.tsx      │
│   renders       │
└────┬────────────┘
     │
     ▼
┌──────────────────────┐
│ DashboardContent     │
│ - useWalletRedirect()│ ← Checks wallet connection
│ - useDashboardData() │ ← Fetches data
└────┬─────────────────┘
     │
     ▼
┌────────────────────────────┐
│   useDashboardData Hook    │
├────────────────────────────┤
│ 1. Check wallet connected  │
│    ↓                       │
│ 2. Get/verify auth token   │
│    ↓                       │
│ 3. Fetch organization data │
│    ↓                       │
│ 4. Fetch notifications     │
│    ↓                       │
│ 5. Transform to types      │
│    ↓                       │
│ 6. Return { data, loading }│
└────┬───────────────────────┘
     │
     ▼
┌────────────────────┐
│  Widget Components │
├────────────────────┤
│ - WalletBalance    │ ← Displays balance
│ - TotalEmployees   │ ← Shows count
│ - ActiveEmployees  │ ← Shows % active
│ - PendingRequest   │ ← Lists requests
│ - RecentActivity   │ ← Shows notifications
└────┬───────────────┘
     │
     ▼
┌──────────────┐
│  Rendered    │
│  Dashboard   │
└──────────────┘
```

## 🗂️ File Responsibility Matrix

| File | Responsibility | Dependencies | Exports |
|------|---------------|--------------|---------|
| `page.tsx` | Route handler | Layout, DashboardContent | default Dashboard |
| `DashboardContent.tsx` | Layout orchestration | Widgets, hooks | DashboardContent |
| `useDashboardData.ts` | Data fetching | API, wagmi, utils | useDashboardData |
| `_types/index.ts` | Type definitions | None | Types |
| `widgets/*.tsx` | UI display | React, types | Widget components |

## 🎨 Widget Grid Layout

```
┌─────────────────────────────────────────────────────────┐
│                    Dashboard Grid                       │
│                                                         │
│  ┌──────────────────┐ ┌──────────┐ ┌──────────┐       │
│  │  WalletBalance   │ │  Total   │ │  Active  │       │
│  │   (col-span-3)   │ │Employees │ │Employees │       │
│  │                  │ │(col-2)   │ │ (col-1)  │       │
│  └──────────────────┘ └──────────┘ └──────────┘       │
│                                                         │
│  ┌──────────────────────────┐  ┌──────────────┐       │
│  │                          │  │    Recent    │       │
│  │     LiveLineChart        │  │   Activity   │       │
│  │      (col-span-4)        │  │  (col-span-2)│       │
│  │                          │  │              │       │
│  └──────────────────────────┘  └──────────────┘       │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │  Pending Request │  │ Pending Payroll  │           │
│  │                  │  │     Volume       │           │
│  └──────────────────┘  └──────────────────┘           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Hook Dependency Graph

```
useDashboardData
    │
    ├── useAccount (wagmi)
    │   └── Gets wallet address & connection status
    │
    ├── useWalletClient (wagmi)
    │   └── Gets wallet client for signing
    │
    ├── useRouter (next/navigation)
    │   └── Handles redirects
    │
    ├── web3AuthService
    │   ├── getNonce()
    │   └── login()
    │
    ├── profileService
    │   └── listOrganizationProfiles()
    │
    └── notificationsService
        └── listNotifications()
```

## 📋 Type Relationships

```
┌──────────────────────┐
│   RecentActivity     │
│  - id: string        │
│  - type: string      │
│  - message: string   │
│  - time: string      │
└──────────┬───────────┘
           │
           │ (array of)
           │
┌──────────▼───────────┐
│   DashboardData      │
│  - totalEmployees    │
│  - activeEmployees   │
│  - performance%      │
│  - pendingRequests   │
│  - pendingPayroll    │
│  - recentActivities[]│
└──────────────────────┘
           │
           │ (used by)
           │
┌──────────▼───────────┐
│ useDashboardData()   │
│  returns:            │
│  {                   │
│    data: Dashboard   │
│         Data | null  │
│    loading: boolean  │
│  }                   │
└──────────────────────┘
```

## 🎭 State Management

```
Component State:
┌─────────────────────────────┐
│  DashboardContent           │
│  ├─ loading (from hook)     │
│  └─ data (from hook)        │
└─────────────────────────────┘

Hook State:
┌─────────────────────────────┐
│  useDashboardData           │
│  ├─ data: DashboardData     │
│  ├─ loading: boolean        │
│  └─ prevAddressRef: Ref     │
└─────────────────────────────┘

Widget State (WalletBalance):
┌─────────────────────────────┐
│  WalletBalance              │
│  └─ balances (from hook)    │
└─────────────────────────────┘
```

## 🚦 Loading States

```
Initial Mount
     │
     ▼
┌─────────────┐
│ Loading...  │ ← LoadingSpinner
└─────────────┘
     │
     ▼ (wallet connected)
┌──────────────┐
│ Authenticat- │
│    ing...    │
└──────────────┘
     │
     ▼ (data fetched)
┌──────────────┐
│  Dashboard   │
│   Loaded     │
└──────────────┘
```

## 🎨 Color Scheme

```css
/* Background */
bg-black           → #000000

/* Borders */
border-[#2C2C2C]   → #2C2C2C (dark gray)
hover:border-blue-500/20 → rgba(59, 130, 246, 0.2)

/* Text */
text-white         → #FFFFFF
text-gray-400      → #9CA3AF
text-gray-500      → #6B7280
text-blue-500      → #3B82F6

/* Status Colors */
blue-500/20        → Success/Info (20% opacity)
green-500/20       → Positive/Growth
red-500/20         → Warning/Negative
purple-500/20      → Organization
yellow-500/20      → Attention
```

## 📱 Responsive Breakpoints

```
Mobile (base)
  ↓
  col-span-full
  p-4
  gap-4

Tablet (md: 768px)
  ↓
  md:col-span-3
  md:p-6
  md:gap-6

Desktop (lg: 1024px)
  ↓
  lg:grid-cols-6
```

---

**This visual guide provides a quick reference for understanding the dashboard module structure at a glance.**

# Dashboard Architecture

## Overview
The dashboard follows a modular, feature-based architecture that separates concerns and promotes reusability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      app/dashboard/                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  page.tsx (Route Handler)                                    │
│    │                                                          │
│    └──> Layout (Sidebar wrapper)                             │
│           │                                                   │
│           └──> DashboardContent (_components/)               │
│                  │                                            │
│                  ├──> useDashboardData (_hooks/)             │
│                  │      │                                     │
│                  │      ├──> useWalletRedirect               │
│                  │      ├──> useAccount (wagmi)              │
│                  │      ├──> useWalletClient (wagmi)         │
│                  │      │                                     │
│                  │      └──> API Services                    │
│                  │             ├─ web3AuthService            │
│                  │             ├─ profileService             │
│                  │             └─ notificationsService       │
│                  │                                            │
│                  └──> Widgets (_components/widgets/)         │
│                         ├─ WalletBalance                     │
│                         ├─ TotalEmployees                    │
│                         ├─ ActiveEmployees                   │
│                         ├─ PendingRequest                    │
│                         ├─ PendingPayrollVolume              │
│                         ├─ RecentActivityWidget              │
│                         └─ LiveLineChart (dynamic)           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Loads Dashboard
       │
       ▼
   page.tsx
       │
       ▼
 DashboardContent
       │
       ├──> useWalletRedirect()
       │    (Ensures wallet connected)
       │
       └──> useDashboardData()
              │
              ├──> Check wallet connection
              │
              ├──> Get/Refresh auth token
              │    (Sign message if needed)
              │
              ├──> Fetch organization data
              │
              ├──> Fetch notifications
              │
              ├──> Transform to DashboardData
              │
              └──> Return { data, loading }
                         │
                         ▼
                   Widgets render
```

## Module Structure

### 1. Route Level (`page.tsx`)
- **Responsibility**: Route definition and layout wrapper
- **Dependencies**: Layout component, DashboardContent
- **Exports**: Default dashboard page component

### 2. Components (`_components/`)

#### DashboardContent
- **Responsibility**: Main layout orchestration
- **Dependencies**: Widgets, hooks, utilities
- **Exports**: Named export `DashboardContent`

#### Widgets (`_components/widgets/`)
- **Responsibility**: Self-contained UI components
- **Dependencies**: Minimal (hooks, utils, types)
- **Exports**: Named exports for each widget

### 3. Hooks (`_hooks/`)

#### useDashboardData
- **Responsibility**: Data fetching and state management
- **Dependencies**: API services, wagmi, utils
- **Returns**: `{ data: DashboardData | null, loading: boolean }`

### 4. Types (`_types/`)
- **Responsibility**: TypeScript type definitions
- **Dependencies**: None
- **Exports**: All dashboard-related interfaces

### 5. Utils (`_utils/`)
- **Responsibility**: Helper functions and formatters
- **Dependencies**: None
- **Status**: Reserved for future use

## Naming Conventions

### Files
- `PascalCase.tsx` - React components
- `camelCase.ts` - TypeScript files (types, utils, hooks)
- `index.ts` - Barrel exports

### Directories
- `_prefix` - Module-private (Next.js convention)
- `plurals` - Collections (widgets, hooks, types, utils)

### Components
- Named exports preferred for tree-shaking
- `use` prefix for hooks
- Descriptive, feature-based names

## Key Principles

### 1. Separation of Concerns
```
UI Layer        → Widgets
Logic Layer     → Hooks
Data Layer      → API Services
Type Layer      → Types
```

### 2. Single Responsibility
Each module has one clear purpose:
- Widgets: Display data
- Hooks: Fetch and manage data
- Types: Define data structures
- Utils: Transform data

### 3. Dependency Direction
```
page.tsx
   ↓
Components
   ↓
Hooks → API Services
   ↓
Types
```

### 4. Reusability
- Widgets can be used in other dashboards
- Hooks can be shared across features
- Types ensure consistency
- Utils provide common transformations

## Benefits

### ✅ Maintainability
- Easy to locate and update specific features
- Clear file organization
- Logical module boundaries

### ✅ Scalability
- Add new widgets without touching existing code
- Extend hooks for new data sources
- Create new dashboard views easily

### ✅ Testability
- Test widgets in isolation
- Mock hooks for unit tests
- Type safety catches errors early

### ✅ Performance
- Code splitting at widget level
- Dynamic imports for heavy components
- Efficient re-renders with proper hooks

### ✅ Developer Experience
- IntelliSense autocomplete
- Type checking
- Clear import paths
- Self-documenting structure

## Comparison: Old vs New

### Old Structure
```
components/dashboard/
  ├── dashboardContent.tsx (200+ lines, mixed concerns)
  ├── WalletBalance.tsx
  ├── TotalEmployees.tsx
  └── ... (scattered files)
```

### New Structure
```
app/dashboard/
  ├── _components/
  │   ├── widgets/           (organized UI)
  │   └── DashboardContent.tsx (clean layout)
  ├── _hooks/                (isolated logic)
  ├── _types/                (type definitions)
  └── page.tsx               (route handler)
```

## Migration Path

When migrating other pages to this pattern:

1. Create feature directory (`app/feature/`)
2. Add `_components/`, `_hooks/`, `_types/`, `_utils/`
3. Move existing components to `_components/`
4. Extract hooks from components to `_hooks/`
5. Define types in `_types/`
6. Add utility functions to `_utils/`
7. Update `page.tsx` to use new structure
8. Create README documenting the module

## Next Steps

After dashboard refactoring:
1. ✅ Dashboard module complete
2. ⏭️ Employees module
3. ⏭️ Payroll module
4. ⏭️ Leave Management module
5. ⏭️ Settings module

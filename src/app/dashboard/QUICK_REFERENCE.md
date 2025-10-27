# Dashboard Module - Quick Reference

## 📁 File Structure
```
dashboard/
├── page.tsx                  # Route handler
├── _components/
│   ├── DashboardContent.tsx  # Main layout
│   └── widgets/
│       ├── index.ts          # Widget exports
│       ├── WalletBalance.tsx
│       ├── TotalEmployees.tsx
│       ├── ActiveEmployees.tsx
│       ├── PendingRequest.tsx
│       └── RecentActivity.tsx
├── _hooks/
│   ├── index.ts              # Hook exports
│   └── useDashboardData.ts   # Data fetching
├── _types/
│   └── index.ts              # Type definitions
└── _utils/                   # Reserved for future use
```

## 🎯 Quick Commands

### Import Components
```tsx
// Import all widgets
import { WalletBalance, TotalEmployees } from './_components/widgets';

// Import layout
import { DashboardContent } from './_components/DashboardContent';
```

### Import Hooks
```tsx
import { useDashboardData } from './_hooks';
```

### Import Types
```tsx
import type { DashboardData, RecentActivity } from './_types';
```

## 🔨 Common Tasks

### Create a New Widget

1. **Create widget file:**
```tsx
// _components/widgets/MyWidget.tsx
interface MyWidgetProps {
  data: string;
}

export function MyWidget({ data }: MyWidgetProps) {
  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-6">
      <h2 className="text-white">{data}</h2>
    </div>
  );
}
```

2. **Export from index:**
```tsx
// _components/widgets/index.ts
export { MyWidget } from './MyWidget';
```

3. **Use in DashboardContent:**
```tsx
import { MyWidget } from './widgets';

// In JSX:
<MyWidget data={data?.myField || 'default'} />
```

### Add New Data Field

1. **Update types:**
```tsx
// _types/index.ts
export interface DashboardData {
  // ... existing fields
  myNewField: string;
}
```

2. **Update hook:**
```tsx
// _hooks/useDashboardData.ts
const dashboardData: DashboardData = {
  // ... existing fields
  myNewField: orgProfile.myNewField || 'default'
};
```

3. **Use in widget:**
```tsx
<MyWidget data={data?.myNewField} />
```

### Add Custom Hook

```tsx
// _hooks/useMyHook.ts
export function useMyHook() {
  const [state, setState] = useState(null);
  
  // Your logic here
  
  return { state };
}

// _hooks/index.ts
export { useMyHook } from './useMyHook';
```

## 🧩 Widget Template

```tsx
/**
 * WidgetName Widget
 * Brief description of what this widget does
 */

import React from 'react';

interface WidgetNameProps {
  data: string;
  count?: number;
}

export function WidgetName({ data, count = 0 }: WidgetNameProps) {
  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-4 md:p-6 
      transition-all duration-300 hover:border-blue-500/20">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">{data}</h3>
      </div>
      
      {/* Content */}
      <div className="mt-4">
        <p className="text-2xl font-semibold text-white">{count}</p>
      </div>
    </div>
  );
}
```

## 🎨 Styling Guidelines

### Colors
- Background: `bg-black`
- Border: `border border-[#2C2C2C]`
- Text: `text-white`, `text-gray-400`
- Accent: `text-blue-500`

### Spacing
- Padding: `p-4 md:p-6`
- Gap: `gap-4`, `gap-6`
- Margin: `mb-4`, `mt-6`

### Responsive
- Mobile first: base classes
- Tablet: `md:` prefix
- Desktop: `lg:` prefix

### Effects
- Hover: `hover:border-blue-500/20`
- Transition: `transition-all duration-300`
- Transform: `hover:scale-105`

## 📊 Data Flow Checklist

- [ ] Widget receives props from DashboardContent
- [ ] DashboardContent gets data from useDashboardData
- [ ] useDashboardData fetches from API services
- [ ] Data transformed to match types
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Null/undefined checks in place

## 🐛 Debugging

### Check Data Flow
```tsx
// In useDashboardData
console.log('Dashboard data:', dashboardData);

// In DashboardContent
console.log('Received data:', data);

// In Widget
console.log('Widget props:', { data, count });
```

### Common Issues

**Widget not showing data:**
- Check if data is passed as prop
- Verify prop name matches interface
- Check for null/undefined values

**Hook not returning data:**
- Ensure wallet is connected
- Check auth token is valid
- Verify API endpoints

**TypeScript errors:**
- Update types in `_types/index.ts`
- Check prop interfaces match usage
- Ensure imports are correct

## 🚀 Performance Tips

1. **Memoize expensive calculations:**
```tsx
const formattedData = useMemo(
  () => formatData(data),
  [data]
);
```

2. **Use dynamic imports for heavy components:**
```tsx
const HeavyWidget = dynamic(
  () => import('./HeavyWidget'),
  { ssr: false }
);
```

3. **Avoid inline functions in JSX:**
```tsx
// ❌ Bad
<Widget onClick={() => handleClick(id)} />

// ✅ Good
const handleWidgetClick = useCallback(
  () => handleClick(id),
  [id]
);
<Widget onClick={handleWidgetClick} />
```

## 📝 Type Examples

```tsx
// Basic interface
interface WidgetProps {
  title: string;
  count: number;
  isActive?: boolean;
}

// With arrays
interface DashboardData {
  activities: Activity[];
  stats: number[];
}

// With unions
type Status = 'pending' | 'active' | 'completed';

// Extending interfaces
interface ExtendedWidget extends WidgetProps {
  additionalField: string;
}
```

## 🔗 Related Files

- Global types: `/src/types/`
- Shared components: `/src/components/common/`
- API services: `/src/services/api.ts`
- Hooks: `/src/hooks/`
- Utils: `/src/utils/`

## 📚 Further Reading

- [Next.js 13+ App Router](https://nextjs.org/docs/app)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

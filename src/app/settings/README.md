# Settings Module

> **Purpose**: Organization profile settings management

## 📁 Structure

```
settings/
├── page.tsx                          # Route entry point
├── _components/
│   ├── index.ts                      # Barrel export
│   └── SettingsContent.tsx           # Main settings form component
├── _hooks/
│   ├── index.ts                      # Barrel export
│   └── useOrganizationSettings.ts    # Settings data & operations hook
└── _types/
    └── index.ts                      # TypeScript definitions
```

## 🎯 Key Features

- **Organization Profile Management**: Edit organization details
- **Form Validation**: Email, URL, and tel input types
- **Edit Mode Toggle**: View and edit modes with cancel functionality
- **Auto-save**: Data persistence with API integration
- **Loading States**: Spinner during data fetch and updates
- **Toast Notifications**: Success/error feedback for all operations

## 🔧 Core Components

### SettingsContent (Main Component)
Organization settings form:
```tsx
import { SettingsContent } from '@/app/settings/_components';

// Manages:
// - Edit mode toggle
// - Form submission
// - Cancel with data reset
```

**Fields**:
- Organization Name (text)
- Email Address (email)
- Organization Address (text)
- Phone Number (tel)
- Website (url)

## 🪝 Hook

### useOrganizationSettings
Manages all settings operations:
```tsx
const {
  isLoading,           // boolean - Initial data fetch
  organizationData,    // OrganizationData | null
  formData,            // OrganizationFormData
  updateFormField,     // (name: string, value: string) => void
  resetForm,           // () => void - Reset to original data
  submitUpdate         // () => Promise<void>
} = useOrganizationSettings();
```

**Features**:
- Fetches organization profile on mount
- Refetches when wallet connection changes
- Form state management
- Partial update support
- Toast notifications for all operations

## 📊 Types

```typescript
interface OrganizationData {
  id: number;
  name: string;
  email: string;
  organization_address: string;
  organization_phone?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

interface OrganizationFormData extends Partial<OrganizationData> {}
```

## 🎨 Styling

- **Dark theme**: Black background with gray-800 borders
- **Form layout**: 2-column grid (mobile: 1 column)
- **Input states**:
  - Disabled: Opacity 50%, no cursor
  - Enabled: Border blue-500 on focus
  - Hover: Blue-700 for buttons
- **Loading spinner**: Blue-500 with transparent border-top

## 🔄 Data Flow

```
Component Mount
      ↓
useOrganizationSettings
      ↓
Fetch profiles from API
      ↓
Set organizationData & formData
      ↓
User clicks "Edit"
      ↓
Enable form inputs
      ↓
User modifies fields
      ↓
updateFormField() updates formData
      ↓
User clicks "Save Changes"
      ↓
submitUpdate() → API call
      ↓
Toast notification
      ↓
Refetch data
      ↓
Disable edit mode
```

## 🚀 Usage Example

```tsx
// In page.tsx
import Layout from '@/components/Sidebar';
import { SettingsContent } from './_components';

export default function SettingsPage() {
  return (
    <Layout>
      <SettingsContent />
    </Layout>
  );
}
```

## 📦 Dependencies

- **wagmi**: `useAccount` for wallet connection status
- **@/services/api**: `profileService` for organization CRUD
- **@/utils/token**: Token management
- **@/utils/toast**: Toast notifications

## 🔐 Security Features

- Token validation before API calls
- Partial updates (only changed fields sent)
- Form validation via HTML5 input types

## 📈 Metrics

- **Original**: 192 lines (page component)
- **Refactored**: ~230 lines across 5 files
- **Type Coverage**: 100%
- **Components**: 1 main component
- **Hooks**: 1 custom hook
- **Complexity**: Low (simple CRUD form)

## 🐛 Error Handling

- Try-catch in hook for API calls
- Toast notifications for all errors
- Console logging for debugging
- Error thrown after toast for component handling

## 🔮 Future Enhancements

- [ ] Logo upload for organization
- [ ] Multiple organization support
- [ ] Organization timezone settings
- [ ] Currency preferences
- [ ] Email notification preferences
- [ ] Two-factor authentication settings
- [ ] API key management
- [ ] Audit log for settings changes

---

**Last Updated**: January 2025  
**Module Status**: ✅ Complete  
**Migration Status**: Fully migrated from monolith

# Constants Structure

Constants được tổ chức theo chức năng để dễ quản lý và tái sử dụng.

## 📁 Cấu trúc

```
constants/
├── index.ts           # Export tất cả constants
├── mockData.ts        # Mock data cho development
├── config.ts          # App configuration
└── README.md          # Documentation
```

## 🎯 Cách sử dụng

### Import constants
```typescript
// Import specific constants
import { MOCK_CHATS, MOCK_CONTACTS } from '@/constants';

// Import all constants
import * as Constants from '@/constants';

// Import from specific file
import { MOCK_PROJECTS } from '@/constants/mockData';
```

### Add new constants
1. Thêm vào file phù hợp (`mockData.ts`, `config.ts`)
2. Export từ file đó
3. Add export vào `constants/index.ts`

## 📋 Constants hiện có

### **mockData.ts**
- `MOCK_CHATS` - Sample chat data
- `MOCK_CONTACTS` - Sample contact data
- `MOCK_PROJECTS` - Sample project data
- `MOCK_ACTIVITIES` - Sample activity data
- `DEPARTMENTS` - Department names array
- `TAB_CONFIGS` - Tab configuration objects

### **config.ts**
- `APP_CONFIG` - App metadata (name, version, API URL)
- `UI_CONFIG` - UI-related constants (sizes, colors)
- `DEFAULTS` - Default values for various components

## 🔧 Best Practices

1. **Naming Convention**: SCREAMING_SNAKE_CASE cho constants
2. **Grouping**: Group related constants together
3. **Immutability**: Sử dụng `as const` để ensure immutability
4. **Documentation**: Comment cho complex constants
5. **Environment**: Sử dụng environment variables khi cần

## 📝 Examples

```typescript
// Simple constant
export const APP_NAME = 'SunShine Decor' as const;

// Array constant
export const DEPARTMENTS = ['Sunshine Decor', 'HLA'] as const;

// Object constant
export const UI_CONFIG = {
  avatarSize: {
    small: 24,
    medium: 50,
    large: 80,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
  },
} as const;

// Mock data
export const MOCK_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    time: '10:30 AM',
    unreadCount: 2,
    isOnline: true,
  },
  // ... more items
];
```

## 🔄 Migration từ local definitions

Khi chuyển từ local definitions sang constants:

1. **Move interfaces** từ component files → `types/`
2. **Move mock data** từ component files → `constants/mockData.ts`
3. **Update imports** trong component files
4. **Remove local definitions** khỏi component files
5. **Test** để đảm bảo không có breaking changes

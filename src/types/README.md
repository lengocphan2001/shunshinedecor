# Types Structure

Cấu trúc types được tổ chức theo domain/feature để dễ quản lý và tái sử dụng.

## 📁 Cấu trúc

```
types/
├── index.ts           # Export tất cả types
├── common.ts          # Common types (User, Navigation, API...)
├── chat.ts            # Chat-related types
├── contact.ts         # Contact-related types
├── project.ts         # Project-related types
├── activity.ts        # Activity-related types
└── README.md          # Documentation
```

## 🎯 Cách sử dụng

### Import types
```typescript
// Import specific types
import { ChatItem, ContactItem } from '@/types';

// Import all types
import * as Types from '@/types';

// Import from specific domain
import { ProjectItemData } from '@/types/project';
```

### Add new types
1. Tạo file mới trong `types/` nếu cần domain mới
2. Export types từ file đó
3. Add export vào `types/index.ts`
4. Update documentation

## 📋 Types hiện có

### **common.ts**
- `User` - User information
- `NavigationTab` - Tab configuration
- `ApiResponse<T>` - API response wrapper
- `PaginationParams` - Pagination parameters

### **chat.ts**
- `ChatItem` - Chat list item
- `ChatMessage` - Individual message
- `ChatRoom` - Chat room/group

### **contact.ts**
- `ContactItem` - Contact information
- `Department` - Department info
- `ContactGroup` - Grouped contacts by department

### **project.ts**
- `ProjectItemData` - Project list item
- `Project` - Full project details
- `Task` - Project task
- `ProjectStatus` - Project status enum

### **activity.ts**
- `ActivityItemData` - Activity list item
- `ActivityLog` - Activity log entry
- `ActivityStatus` - Activity status enum

## 🔧 Best Practices

1. **Naming Convention**: PascalCase cho interfaces, camelCase cho properties
2. **Optional Properties**: Sử dụng `?` cho properties có thể undefined
3. **Enums**: Sử dụng union types thay vì enums khi có thể
4. **Generic Types**: Sử dụng generics cho reusable types
5. **Documentation**: Comment cho complex types

## 📝 Examples

```typescript
// Simple interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Interface with optional properties
export interface ContactItem {
  id: string;
  name: string;
  displayName: string;
  phone: string;
  email: string;
  department: string;
  position?: string;        // Optional
  avatar?: string;          // Optional
  isOnline?: boolean;       // Optional
}

// Union types
export type ProjectStatus = 'planning' | 'inProgress' | 'completed';

// Generic interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

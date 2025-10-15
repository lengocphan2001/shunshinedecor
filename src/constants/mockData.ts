// Import types for type annotations
import type { ChatItem } from '../types/chat';
import type { ContactItem } from '../types/contact';
import type { ProjectItemData } from '../types/project';
import type { ActivityItemData } from '../types/activity';

// Mock Chat Data
export const MOCK_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    time: '10:30 AM',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    lastMessage: 'Can we meet tomorrow?',
    time: '9:15 AM',
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    lastMessage: 'Thanks for the update!',
    time: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Emily Brown',
    lastMessage: 'The project looks great',
    time: 'Yesterday',
    unreadCount: 3,
    isOnline: false,
  },
];

// Mock Contact Data
export const MOCK_CONTACTS: ContactItem[] = [
  // Sunshine Decor Department
  {
    id: '1',
    name: 'Đại',
    displayName: 'SSD_Đại',
    phone: '0967891234',
    email: 'daltv@unshinedecor.net',
    department: 'Sunshine Decor',
  },
  {
    id: '2',
    name: 'Lục',
    displayName: 'SSD_Lục',
    phone: '0967891234',
    email: 'lucnp@unshinedecor.net',
    department: 'Sunshine Decor',
  },
  // HLA Department
  {
    id: '3',
    name: 'Đại',
    displayName: 'SSD_Đại',
    phone: '0967891234',
    email: 'daltv@unshinedecor.net',
    department: 'HLA',
  },
  {
    id: '4',
    name: 'Lục',
    displayName: 'SSD_Lục',
    phone: '0967891234',
    email: 'lucnp@unshinedecor.net',
    department: 'HLA',
  },
];

// Mock Project Data
export const MOCK_PROJECTS: ProjectItemData[] = [
  {
    id: '1',
    name: '4Ps',
    dateRange: '02/Apr-05/Sep',
    count: 15,
    status: 'onSchedule',
    statusText: 'On Schedule',
  },
  {
    id: '2',
    name: 'HLA_TA',
    dateRange: '02/Apr-05/Sep',
    count: 3,
    status: 'late',
    statusText: '2 days late',
  },
  {
    id: '3',
    name: 'RECHIC_HNC',
    dateRange: '02/Apr-05/Sep',
    count: 3,
    status: 'warning',
    statusText: '1 day late',
  },
];

// Mock Activity Data
export const MOCK_ACTIVITIES: ActivityItemData[] = [
  {
    id: '1',
    title: 'HLA_HNC',
    description: 'MXPhong comment với ảnh của bạn',
    status: 'success',
    thumbnailImage: require('../../assets/background.jpg'),
    timestamp: new Date(),
  },
  {
    id: '2',
    title: 'RECHIC',
    description: 'MXPhong comment với ảnh của bạn',
    status: 'error',
    thumbnailImage: require('../../assets/background.jpg'),
    timestamp: new Date(),
  },
  {
    id: '3',
    title: 'BALA_HNC',
    description: 'MXPhong comment với ảnh của bạn',
    status: 'warning',
    thumbnailImage: require('../../assets/background.jpg'),
    timestamp: new Date(),
  },
];

// Department names
export const DEPARTMENTS = ['Sunshine Decor', 'HLA'] as const;

// Tab configurations
export const TAB_CONFIGS = {
  chat: {
    id: 'chat' as const,
    label: 'Chat',
  },
  contact: {
    id: 'contact' as const,
    label: 'Contact',
  },
} as const;

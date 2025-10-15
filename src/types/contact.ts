export interface ContactItem {
  id: string;
  name: string;
  displayName: string;
  phone: string;
  email: string;
  department: string;
  position?: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  contactCount: number;
}

export interface ContactGroup {
  department: string;
  contacts: ContactItem[];
}

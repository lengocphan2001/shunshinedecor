export enum UserRole {
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface UserProps {
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
}



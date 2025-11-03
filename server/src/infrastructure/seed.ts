import UserModel from './models/UserModel';
import { hashPassword } from '../application/auth/password';
import { UserRole } from '../domain/user';

export async function seedAdmins() {
  const admins = [
    { email: 'shunshinedecor@admin.com', fullName: 'Shunshine Decor', password: 'Admin@123', role: UserRole.ADMIN },
    { email: 'shunshinedev@admin.com', fullName: 'Shunshine Dev', password: 'Admin@123', role: UserRole.ADMIN },
  ];

  for (const a of admins) {
    const exists = await UserModel.findOne({ email: a.email });
    if (exists) continue;
    const passwordHash = await hashPassword(a.password);
    await UserModel.create({ email: a.email, fullName: a.fullName, passwordHash, role: a.role, isActive: true });
  }
}



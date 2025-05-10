import type { UserRole } from '../entities/User';

export interface ChatUser {
  id: string;
  email: string;
  name: string;
  role: UserRole | string;
  isAdmin: boolean;
}

import jwt from 'jsonwebtoken';
import * as fs from 'node:fs';
import { AppDataSource } from '../configs/datasource';
import { User } from '../entities/User';
import type { ChatUser } from '../types/user';

// Read the public key for JWT verification
const public_key = fs.readFileSync('public.pem', 'utf8');

interface JwtPayload {
  sub: string; // Email
  role: string;
  iat: number;
}

/**
 * Get user information from a JWT token using your existing auth service
 * @param token The JWT token to verify
 * @returns The user object if token is valid, null otherwise
 */
export async function getUserFromToken(
  token: string,
): Promise<ChatUser | null> {
  try {
    // Verify the token using the public key
    const payload = jwt.verify(token, public_key) as JwtPayload;

    if (!payload || !payload.sub) {
      return null;
    }

    // Get user from database using the email from the token
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email: payload.sub },
      relations: {
        teacher: true,
        student: true,
        admin: true,
      },
    });

    if (!user) {
      return null;
    }

    // Convert to ChatUser format
    const chatUser: ChatUser = {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      name: getUserDisplayName(user),
      isAdmin: user.role === 'admin',
    };

    return chatUser;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * Check if a user has admin privileges
 * @param userId The user ID to check
 * @returns True if the user is an admin, false otherwise
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: Number.parseInt(userId) },
    });

    return user?.role === 'admin';
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

/**
 * Get the display name for a user based on their role
 * @param user The user object
 * @returns The display name
 */
function getUserDisplayName(user: User): string {
  if (user.admin) {
    return `${user.admin.firstname} ${user.admin.lastname}`;
  } else if (user.teacher) {
    return `${user.teacher.firstname} ${user.teacher.lastname}`;
  } else if (user.student) {
    return `${user.student.firstname} ${user.student.lastname}`;
  }

  // Fallback to email if no profile info is available
  return user.email;
}

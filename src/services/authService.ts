import jwt from 'jsonwebtoken';
import { AppDataSource } from '../configs/datasource';
import { User } from '../entities/User';

// JWT secret key - should be in environment variables in a real application
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Verify a JWT token and return the user
 * @param token The JWT token to verify
 * @returns The user object if token is valid, null otherwise
 */
export async function verifyToken(token: string) {
  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Get user from database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: Number(decoded.id) },
    });

    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Generate a JWT token for a user
 * @param user The user object
 * @returns The JWT token
 */
export function generateToken(user: User) {
  // Create token payload
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // Sign the token
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });

  return token;
}

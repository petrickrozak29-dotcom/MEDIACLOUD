import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '900'; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || '604800'; // 7 days

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
  };
  expiresIn: number;
}

// Password strength validation helper
export function validatePasswordStrength(password: string): boolean {
  if (password.length < 8) return false;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
}

// Email validation (RFC 5322 basic)
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function register(input: RegisterInput): Promise<LoginResponse> {
  const { email, password, name } = input;

  // Validate email format
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Validate password strength
  if (!validatePasswordStrength(password)) {
    throw new Error(
      'Password must be at least 8 characters and contain uppercase, lowercase, digit, and special character'
    );
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password (10 rounds minimum)
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      lastLogin: new Date(),
      preferences: {
        create: {
          interests: '',
          budgetLevel: 'moderate',
          mobilityLevel: 5,
          maxSpendPerDay: 0,
          distancePreference: 5,
          language: 'id'
        }
      }
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true
    }
  });

  // Generate tokens
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: parseInt(JWT_EXPIRE) }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: parseInt(REFRESH_TOKEN_EXPIRE) }
  );

  return {
    token,
    refreshToken,
    user,
    expiresIn: parseInt(JWT_EXPIRE)
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  // Query user by email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  // Generate JWT tokens
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: parseInt(JWT_EXPIRE) }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: parseInt(REFRESH_TOKEN_EXPIRE) }
  );

  return {
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar
    },
    expiresIn: parseInt(JWT_EXPIRE)
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  type?: string;
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<{ token: string; expiresIn: number }> {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as TokenPayload;

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      JWT_SECRET,
      { expiresIn: parseInt(JWT_EXPIRE) }
    );

    return {
      token: newToken,
      expiresIn: parseInt(JWT_EXPIRE)
    };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

export async function logout(userId: string): Promise<void> {
  // Placeholder for token revocation logic
  // In production, you'd maintain a blacklist or store refresh tokens in DB
  console.log(`User ${userId} logged out`);
}

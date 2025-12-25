import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/userRepository';
import { PrismaUser } from '@prisma/client';

interface RegisterUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const userRepository = new UserRepository();

export const registerUser = async (userData: RegisterUserData): Promise<PrismaUser> => {
  const { email, firstName, lastName, password } = userData;

  // Check if user already exists
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser = await userRepository.create({
    email,
    firstName,
    lastName,
    password: hashedPassword,
    role: 'user'
  });

  return newUser;
};

export const loginUser = async (credentials: LoginCredentials): Promise<{ user: PrismaUser; token: string }> => {
  const { email, password } = credentials;

  // Find user by email with password
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '7d' }
  );

  return { user, token };
};

export const getUserProfile = async (userId: string): Promise<PrismaUser> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserProfile = async (userId: string, updateData: Partial<PrismaUser>): Promise<PrismaUser> => {
  const user = await userRepository.updateById(userId, updateData);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
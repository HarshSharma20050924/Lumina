import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/userRepository';
import { IUser } from '../models/User';

interface RegisterUserData {
  email: string;
  name: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const userRepository = new UserRepository();

export const registerUser = async (userData: RegisterUserData): Promise<IUser> => {
  const { email, name, password } = userData;

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
    name,
    password: hashedPassword,
    role: 'user'
  });

  return newUser;
};

export const loginUser = async (credentials: LoginCredentials): Promise<{ user: IUser; token: string }> => {
  const { email, password } = credentials;

  // Find user by email with password
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password!);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '7d' }
  );

  return { user, token };
};

export const getUserProfile = async (userId: string): Promise<IUser> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserProfile = async (userId: string, updateData: Partial<IUser>): Promise<IUser> => {
  const user = await userRepository.updateById(userId, updateData);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
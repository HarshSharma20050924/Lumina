import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
};
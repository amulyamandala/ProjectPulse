import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_access_secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // 7 days

export interface JwtPayload {
  userId: string;
}

export const generateAccessToken = (userId: mongoose.Types.ObjectId | string): string => {
  return jwt.sign({ userId: userId.toString() }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (userId: mongoose.Types.ObjectId | string): string => {
  return jwt.sign({ userId: userId.toString() }, REFRESH_TOKEN_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
};

export const getRefreshTokenExpiryDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
  return date;
};

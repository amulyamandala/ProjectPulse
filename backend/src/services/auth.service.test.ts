import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { authService } from './auth.service';
import { User, RefreshToken } from '../models';

jest.mock('../utils/jwt', () => ({
  generateAccessToken: jest.fn(() => 'mock-access-token'),
  generateRefreshToken: jest.fn(() => 'mock-refresh-token'),
  verifyRefreshToken: jest.fn(() => ({ userId: 'mock-user-id' })),
  getRefreshTokenExpiryDate: jest.fn(() => new Date('2030-01-01')),
}));

describe('Auth Service', () => {
  let mockUser: any;

  beforeAll(() => {
    // We would normally connect to a test DB here, but for service testing we can mock mongoose models
    // or use mongodb-memory-server.
    // For simplicity, we mock the Mongoose model methods.
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = {
      _id: new mongoose.Types.ObjectId(),
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
    };
  });

  describe('register', () => {
    it('should throw an error if user already exists', async () => {
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      
      await expect(authService.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      })).rejects.toThrow('User with this email already exists');
    });

    it('should successfully register a new user', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('new-hashed-password' as never);
      User.create = jest.fn().mockResolvedValue(mockUser);
      RefreshToken.create = jest.fn().mockResolvedValue({});

      const result = await authService.register({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      });

      expect(User.create).toHaveBeenCalled();
      expect(RefreshToken.create).toHaveBeenCalled();
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
    });
  });

  describe('login', () => {
    it('should throw an error for invalid email', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      await expect(authService.login({ email: 'wrong@example.com', password: 'password' })).rejects.toThrow('Invalid email or password');
    });

    it('should successfully log in with valid credentials', async () => {
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      RefreshToken.create = jest.fn().mockResolvedValue({});

      const result = await authService.login({ email: 'test@example.com', password: 'password' });
      
      expect(result.accessToken).toBe('mock-access-token');
      expect(RefreshToken.create).toHaveBeenCalled();
    });
  });
});

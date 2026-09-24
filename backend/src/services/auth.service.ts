import bcrypt from 'bcryptjs';
import { User, RefreshToken } from '../models';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiryDate, verifyRefreshToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '@projectpulse/shared';

export const authService = {
  async register(data: RegisterInput) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      passwordHash,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const expiresAt = getRefreshTokenExpiryDate();

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt,
    });

    return { user, accessToken, refreshToken, expiresAt };
  },

  async login(data: LoginInput) {
    const user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user || !user.isActive) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const expiresAt = getRefreshTokenExpiryDate();

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt,
    });

    return { user, accessToken, refreshToken, expiresAt };
  },

  async refreshTokens(oldRefreshToken: string) {
    // 1. Check if token exists in DB and is not revoked
    const tokenDoc = await RefreshToken.findOne({ token: oldRefreshToken });
    if (!tokenDoc) {
      throw new Error('Invalid refresh token');
    }
    if (tokenDoc.isRevoked) {
      // Security measure: if a revoked token is used, it means it's compromised.
      // Ideally, we should revoke all tokens for this user, but for now we just fail.
      throw new Error('Token has been revoked');
    }

    // 2. Verify JWT signature/expiry
    let payload;
    try {
      payload = verifyRefreshToken(oldRefreshToken);
    } catch (e) {
      // If expired or invalid signature, revoke the token to clean up DB
      tokenDoc.isRevoked = true;
      await tokenDoc.save();
      throw new Error('Invalid or expired refresh token');
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // 3. Rotate token
    tokenDoc.isRevoked = true;
    await tokenDoc.save();

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    const expiresAt = getRefreshTokenExpiryDate();

    await RefreshToken.create({
      token: newRefreshToken,
      userId: user._id,
      expiresAt,
    });

    return { user, accessToken, refreshToken: newRefreshToken, expiresAt };
  },

  async logout(refreshToken: string) {
    await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { isRevoked: true }
    );
  }
};

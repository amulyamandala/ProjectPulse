import { authService } from "../services/auth.service.js";
import { RegisterSchema, LoginSchema } from "@projectpulse/shared";
import { z } from "zod";

const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

// Utility for formatting auth response
const formatAuthResponse = (user, accessToken) => ({
  user: {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  },
  accessToken,
});

const setRefreshTokenCookie = (res, token, expiresAt) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Should be 'strict' in true prod, but 'lax' helps with local dev/testing
    expires: expiresAt,
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const authController = {
  async register(req, res) {
    try {
      const data = RegisterSchema.parse(req.body);
      const { user, accessToken, refreshToken, expiresAt } =
        await authService.register(data);

      setRefreshTokenCookie(res, refreshToken, expiresAt);
      res.status(201).json(formatAuthResponse(user, accessToken));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Validation Error", details: error.errors });
      }
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  },

  async login(req, res) {
    try {
      const data = LoginSchema.parse(req.body);
      const { user, accessToken, refreshToken, expiresAt } =
        await authService.login(data);

      setRefreshTokenCookie(res, refreshToken, expiresAt);
      res.status(200).json(formatAuthResponse(user, accessToken));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Validation Error", details: error.errors });
      }
      res.status(401).json({ error: error.message || "Login failed" });
    }
  },

  async refresh(req, res) {
    try {
      const oldRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
      if (!oldRefreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
      }

      const { user, accessToken, refreshToken, expiresAt } =
        await authService.refreshTokens(oldRefreshToken);

      setRefreshTokenCookie(res, refreshToken, expiresAt);
      res.status(200).json(formatAuthResponse(user, accessToken));
    } catch (error) {
      clearRefreshTokenCookie(res);
      res
        .status(401)
        .json({ error: error.message || "Session expired or invalid" });
    }
  },

  async logout(req, res) {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      clearRefreshTokenCookie(res);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  },
  async me(req, res) {
    // Requires requireAuth middleware
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.status(200).json({
      user: {
        id: req.user._id.toString(),
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
    });
  },
};

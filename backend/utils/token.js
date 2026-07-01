import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  JWT_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
} from "../config/index.js";

// Access Token
export const signAccessToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });

// Refresh Token
export const signRefreshToken = (payload) =>
  jwt.sign(
    {
      ...payload,
      jti: crypto.randomUUID(), // ensures every refresh token is unique
    },
    JWT_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES,
    }
  );

// Verify Access/Refresh Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
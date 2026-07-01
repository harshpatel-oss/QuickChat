import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
export const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
export const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "30d";
export const COOKIE_NAME = process.env.COOKIE_NAME || "refreshToken";
export const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || "lax";
export const COOKIE_SECURE = NODE_ENV === "production";
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_KEY;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

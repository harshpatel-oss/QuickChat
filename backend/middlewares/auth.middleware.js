import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import { JWT_SECRET, COOKIE_NAME } from "../config/index.js";
import { errorResponse } from "../utils/response.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.token;
    // console.log(authHeader)
    // console.log(authHeader)
    if (!authHeader) return errorResponse(res, "Authorization header required", 401);

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    //console.log(token)
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return errorResponse(res, "User not found", 404);

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired access token", 401);
  }
};

export const refreshRoute = async (req, res, next) => {
  try {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (!refreshToken) return errorResponse(res, "Refresh token required", 401);

    const storedToken = await RefreshToken.findOne({ token: refreshToken, revoked: false });
    if (!storedToken) return errorResponse(res, "Invalid refresh token", 401);

    next();
  } catch (error) {
    return errorResponse(res, "Refresh middleware failure", 401);
  }
};

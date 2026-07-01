import { body } from "express-validator";

export const signupValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required."),
  body("email").isEmail().withMessage("Valid email is required."),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars."),
  body("bio").optional().trim().isLength({ max: 200 }),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

export const forgotPasswordValidator = [
  body("email").isEmail().withMessage("Valid email is required."),
];

export const resetPasswordValidator = [
  body("token").notEmpty().withMessage("Token is required."),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars."),
];

export const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be 6+ chars."),
];

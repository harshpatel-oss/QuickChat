import { body } from "express-validator";

export const sendMessageValidator = [
  body("text").optional().trim().isString(),
  body("image").optional().isString(),
];

import { body } from "express-validator";

export const createGroupValidator = [
  body("name").trim().notEmpty().withMessage("Group name is required."),
  body("description").optional().trim().isString(),
  body("isPrivate").isBoolean().withMessage("Privacy flag must be boolean."),
];

export const groupMemberValidator = [
  body("memberId").trim().notEmpty().withMessage("Member id is required."),
];

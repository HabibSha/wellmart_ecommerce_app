import { body } from "express-validator";

const validateCategory = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2 })
    .withMessage("Category should be at least 2 characters long"),
];

export default validateCategory;

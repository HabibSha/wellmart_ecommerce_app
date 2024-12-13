import { body } from "express-validator";

const validateBrand = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Brand is required")
    .isLength({ min: 2 })
    .withMessage("Brand should be at least 2 characters long"),
];

export default validateBrand;

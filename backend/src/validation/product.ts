import { body } from "express-validator";

const validateProduct = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 2 })
    .withMessage("Product title should be at least minimum 2 characters")
    .isLength({ max: 150 })
    .withMessage("Product title can be maximum 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 3 })
    .withMessage("Product description should be at least 3 characters"),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number"),
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 1 })
    .withMessage("Product quantity must be a positive integer"),
  body("image").notEmpty().withMessage("Product image is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("brand").trim().notEmpty().withMessage("Brand is required"),
];

export { validateProduct };

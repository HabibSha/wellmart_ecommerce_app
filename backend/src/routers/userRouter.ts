import { Router } from "express";

import {
  handleUserRegister,
  handleGetAllUsers,
} from "../controllers/userController";
import { handleUserLogin } from "../controllers/authController";
import { uploadUserImage } from "../middleware/fileUpload";
import {
  validateUserRegistration,
  validateUserLogin,
} from "../validation/auth";
import runValidation from "../validation";

const userRouter = Router();

userRouter.post(
  "/register",
  uploadUserImage.single("image"),
  validateUserRegistration,
  runValidation,
  handleUserRegister
);
userRouter.post("/login", validateUserLogin, runValidation, handleUserLogin);
userRouter.post("/users", handleGetAllUsers);

export default userRouter;

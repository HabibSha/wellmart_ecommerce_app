import { Router } from "express";

import {
  handleUserRegister,
  handleGetAllUsers,
  handleGetSingleUser,
  handleUpdateUser,
  handleDeleteUser,
} from "../controllers/userController";
import { handleUserLogin } from "../controllers/authController";
import { uploadUserImage } from "../middleware/fileUpload";
import {
  validateUserRegistration,
  validateUserLogin,
} from "../validation/auth";
import runValidation from "../validation";
import { isLoggedIn, isAdmin } from "../middleware/auth";

const userRouter = Router();

userRouter.post(
  "/register",
  uploadUserImage.single("image"),
  validateUserRegistration,
  runValidation,
  handleUserRegister
);
userRouter.post("/login", validateUserLogin, runValidation, handleUserLogin);
userRouter.get("/", handleGetAllUsers);
userRouter.get("/:id", handleGetSingleUser);
userRouter.put("/:id", isLoggedIn, handleUpdateUser);
userRouter.delete("/:id", isLoggedIn, isAdmin, handleDeleteUser);

export default userRouter;

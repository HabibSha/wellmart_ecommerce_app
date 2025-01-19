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
userRouter.put("/:id", handleUpdateUser);
userRouter.delete("/:id", handleDeleteUser);

export default userRouter;

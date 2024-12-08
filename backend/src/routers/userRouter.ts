import { Router } from "express";

import {
  handleUserRegister,
  handleGetAllUsers,
} from "../controllers/userController";
import { handleUserLogin } from "../controllers/authController";
import uploadUserImage from "../middleware/fileUpload";

const userRouter = Router();

userRouter.post(
  "/register",
  uploadUserImage.single("image"),
  handleUserRegister
);
userRouter.post("/login", handleUserLogin);
userRouter.post("/users", handleGetAllUsers);

export default userRouter;

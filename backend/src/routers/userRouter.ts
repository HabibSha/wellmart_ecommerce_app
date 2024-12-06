import { Router } from "express";

import {
  handleUserRegister,
  handleGetAllUsers,
} from "../controllers/userController";
import { handleUserLogin } from "../controllers/authController";
import upload from "../middleware/fileUpload";

const userRouter = Router();

userRouter.post("/register", upload.single("image"), handleUserRegister);
userRouter.post("/login", handleUserLogin);
userRouter.post("/users", handleGetAllUsers);

export default userRouter;

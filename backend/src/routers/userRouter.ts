import { Router } from "express";

import {
  handleUserRegister,
  handleGetAllUsers,
} from "../controllers/userController";
import { handleUserLogin } from "../controllers/authController";

const userRouter = Router();

userRouter.post("/register", handleUserRegister);
userRouter.post("/login", handleUserLogin);
userRouter.post("/users", handleGetAllUsers);

export default userRouter;

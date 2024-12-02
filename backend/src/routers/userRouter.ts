import { Router } from "express";

import {
  handleUserRegister,
  handleGetAllUsers,
} from "../controllers/userController";

const userRouter = Router();

userRouter.post("/register", handleUserRegister);
userRouter.post("/users", handleGetAllUsers);

export default userRouter;

import { Router } from "express";

import { handleUserRegister } from "../controllers/userController";

const userRouter = Router();

userRouter.post("/register", handleUserRegister);

export default userRouter;

import express from "express";

import { loginUser } from "./login/post";
import { refreshToken } from "./refresh-token/post";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/refresh-token", refreshToken);

export { authRouter };

import express from "express";

import { loginUser } from "./login/post";
import { refreshToken } from "./refresh-token/post";
import { logoutUser } from "./logout/post";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/refresh-token", refreshToken);

export { authRouter };

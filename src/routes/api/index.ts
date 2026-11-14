import express from "express";
import merge from "deepmerge";

import { userRouter } from "#routes/api/user";
import { authRouter } from "#routes/api/auth";

import { authMiddleware } from "#middlewares/routes/auth";

import userSwagger from "#routes/api/user/swagger.json";
import authSwagger from "#routes/api/auth/swagger.json";
import mainSwagger from "#routes/api/swagger.json";

const apiRouter = express.Router();

apiRouter.use("/user", authMiddleware, userRouter);
apiRouter.use("/auth", authRouter);

apiRouter.get("/swagger", function (_req, res) {
  res.json(merge.all([mainSwagger, userSwagger, authSwagger]));
});

export { apiRouter };

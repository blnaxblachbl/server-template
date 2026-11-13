import express from "express";

import mainSwagger from "#routes/api/swagger.json";

const apiRouter = express.Router();

apiRouter.get("/swagger", function (_req, res) {
  res.json(mainSwagger);
});

export { apiRouter };

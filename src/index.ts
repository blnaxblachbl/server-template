import cors from "cors";
import express from "express";
import http from "http";

import { apiRouter } from "#routes/api";
import { ENV } from "#utils/config";

(async () => {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    cors<cors.CorsRequest>({
      origin: "*",
    }),
  );

  app.use("/api", express.json(), apiRouter);

  app.use("/*splat", (_, res) => {
    res.status(404).send("Not Found");
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: ENV.PORT }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:${ENV.PORT}/`);
})();

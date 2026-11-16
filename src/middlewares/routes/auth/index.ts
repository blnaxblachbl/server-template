import type { Request, Response, NextFunction } from "express";

import { createContext } from "#utils/context";
import { ENV } from "#utils/config";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const context = await createContext({ req, res });

  if (!context.apiKey && !context.verify) {
    return res.status(401).json({ message: "Api key or token not provided" });
  }
  if (context.apiKey && context.apiKey !== ENV.API_KEY) {
    return res.status(401).json({ message: "Invalid API key" });
  }
  if (context.verify && context.verify.expired) {
    return res.status(401).json({ message: "Token expired" });
  }

  next();
};

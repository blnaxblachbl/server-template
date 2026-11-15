import { ExpressContextFunctionArgument } from "@as-integrations/express5";
import { Request, Response } from "express";

import { prisma } from "#utils/prisma";
import { Verify } from "#utils/token/types";
import { verifyAccessToken } from "#utils/token/verify";

export type Context = {
  prisma: typeof prisma;
  req: Request;
  res: Response;
  apiKey: string | undefined;
  verify: Verify | null;
  refreshToken?: string;
};

export const createContext = ({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<Context> => {
  const { authorization } = req.headers;
  const apiKey = req.headers["x-api-key"] as string | undefined;
  const sessionToken = req.session.accessToken;
  let token = "";

  if (sessionToken) {
    token = sessionToken;
  } else if (authorization) {
    token = authorization.replace("Bearer ", "") || "";
  }
  const verify = verifyAccessToken(token);

  return Promise.resolve({
    prisma,
    req,
    res,
    apiKey,
    verify,
    refreshToken: req.session.refreshToken,
  });
};

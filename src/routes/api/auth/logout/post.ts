import type { Request, Response } from "express";

import { clearTokens } from "#utils/cookie";

export async function logoutUser(
  req: Request<any, any, { email: string; password: string }>,
  res: Response,
) {
  clearTokens(res);
  res.sendStatus(200);
}

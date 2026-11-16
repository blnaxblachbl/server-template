import type { Request, Response } from "express";

import { ENV } from "#utils/config";
import { AllTokens } from "#utils/token/types";

export function setTokens(
  req: Request,
  res: Response,
  { accessToken, refreshToken }: AllTokens,
) {
  res.cookie("accessToken", accessToken, {
    path: "/",
    httpOnly: true,
    sameSite: ENV.IS_DEV ? "none" : "lax",
    secure: req.secure,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    sameSite: ENV.IS_DEV ? "none" : "lax",
    secure: req.secure,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearTokens(res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
}

import type { Request, Response } from "express";

import { createContext } from "#utils/context";
import { generateAllTokens } from "#utils/token/generate";
import { USER_FIELDS } from "#utils/constants";
import { verifyRefreshToken } from "#utils/token/verify";
import { refreshTokenSchema } from "#utils/zod-schemas/user";

export async function refreshToken(req: Request, res: Response) {
  const { prisma, verify, refreshToken } = await createContext({ req, res });
  if (!verify) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { data: body, error } = refreshTokenSchema.safeParse(req.body);
  const token = body?.refreshToken ?? refreshToken;
  if (!token) {
    return res.status(400).json({
      message: error?.issues[0].message ?? "Refresh Token not provided",
    });
  }
  const refreshTokenVerified = verifyRefreshToken(token);
  if (!refreshTokenVerified || verify.id !== refreshTokenVerified.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: verify.id },
      select: USER_FIELDS,
    });
    if (!user || user.deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateAllTokens({
      id: user.id,
      email: user.email,
    });

    req.session.accessToken = accessToken;
    req.session.refreshToken = newRefreshToken;
    req.session.save();

    res.json({ user, accessToken, refreshToken: newRefreshToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

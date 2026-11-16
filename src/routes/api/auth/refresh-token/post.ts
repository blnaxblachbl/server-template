import type { Request, Response } from "express";

import { createContext } from "#utils/context";
import { generateAllTokens } from "#utils/token/generate";
import { USER_FIELDS } from "#utils/constants";
import { verifyRefreshToken } from "#utils/token/verify";
import { refreshTokenSchema } from "#utils/zod-schemas/user";
import { setTokens } from "#utils/cookie";

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
    const tokens = generateAllTokens({
      id: user.id,
      email: user.email,
    });

    setTokens(req, res, tokens);
    res.json({ user, ...tokens });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

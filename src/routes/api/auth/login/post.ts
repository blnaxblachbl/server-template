import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { createContext } from "#utils/context";
import { USER_FIELDS } from "#utils/constants";
import { generateAllTokens } from "#utils/token/generate";
import { loginSchema } from "#utils/zod-schemas/user";
import { setTokens } from "#utils/cookie";

export async function loginUser(
  req: Request<any, any, { email: string; password: string }>,
  res: Response,
) {
  const { success, data: body, error } = loginSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const { email, password } = body;

  const { prisma } = await createContext({ req, res });
  try {
    const user = await prisma.user
      .findUnique({
        where: { email },
        select: { ...USER_FIELDS, password: true },
      })
      .catch((e) => {
        return null;
      });
    if (!user || user.deleted || !bcrypt.compareSync(password, user.password)) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
    const { password: _userPassword, ...userData } = user;
    const tokens = generateAllTokens({
      id: userData.id,
      email: userData.email,
    });

    setTokens(req, res, tokens);
    return res.json({ user: userData, ...tokens });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

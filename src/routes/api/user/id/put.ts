import type { Request, Response } from "express";

import { createContext } from "#utils/context";
import { USER_FIELDS } from "#utils/constants";
import { numberId } from "#utils/zod-schemas/id";
import { updateUserSchema } from "#utils/zod-schemas/user";
import { Prisma } from "#utils/prisma/generated/client";

export async function updateUser(req: Request, res: Response) {
  const { prisma } = await createContext({ req, res });
  const { success, data: params, error } = numberId.safeParse(req.params);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const { id } = params;

  const {
    success: bodySuccess,
    data: bodyData,
    error: bodyError,
  } = updateUserSchema.safeParse(req.body);
  if (!bodySuccess) {
    return res.status(400).json({ message: bodyError.issues[0].message });
  }
  const { name, email } = bodyData;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
      select: USER_FIELDS,
    });
    res.json(user);
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(400).json({ message: "Email already in use" });
      }
    }
    res.status(500).json({ message: "Unknown error" });
  }
}

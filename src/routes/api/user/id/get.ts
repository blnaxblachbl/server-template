import type { Request, Response } from "express";

import { numberId } from "#utils/zod-schemas/id";
import { createContext } from "#utils/context";
import { USER_FIELDS } from "#utils/constants";

export async function getUserById(req: Request, res: Response) {
  const { prisma } = await createContext({ req, res });
  const { success, data: params, error } = numberId.safeParse(req.params);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const { id } = params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: USER_FIELDS,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

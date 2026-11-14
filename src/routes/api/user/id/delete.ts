import type { Request, Response } from "express";

import { numberId } from "#utils/zod-schemas/id";
import { createContext } from "#utils/context";
import { USER_FIELDS } from "#utils/constants";

export async function deleteUser(req: Request, res: Response) {
  const { success, data: params, error } = numberId.safeParse(req.params);
  if (!success) {
    return res.status(400).json({ message: error.issues[0].message });
  }
  const { id } = params;
  const { prisma, verify } = await createContext({ req, res });
  if (id === 1) {
    return res.status(404).json({ message: "User not found" });
  }
  if (verify?.id === id) {
    return res.status(400).json({ message: "Cannot delete yourself" });
  }
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { deleted: true },
      select: USER_FIELDS,
    });
    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Unknown error" });
  }
}

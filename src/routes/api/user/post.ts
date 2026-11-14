import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import z from "zod";

import { createContext } from "#utils/context";
import { PrismaClientKnownRequestError } from "#utils/prisma/generated/runtime/client";
import { USER_FIELDS } from "#utils/constants";
import { ENV } from "#utils/config";
import { generatePassword } from "#utils/tools/generatePassword";
import { createUserSchema } from "#utils/zod-schemas/user";

export async function createUser(req: Request, res: Response) {
  const { prisma } = await createContext({ req, res });
  const {
    success,
    data: body,
    error: bodyError,
  } = createUserSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: bodyError.issues[0].message });
  }
  const generatedPassword = generatePassword();
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  if (ENV.IS_DEV) {
    console.log("password", generatedPassword);
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
      select: USER_FIELDS,
    });
    if (!user) {
      return new Error("Something went wrong");
    }
    res.json(user);
  } catch (e: unknown) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res.status(400).json({ message: "Email already in use" });
      }
    }
    if (e instanceof Error) {
      return res.status(500).json({ message: e.message });
    }
    res.status(500).json({ message: "Unknown error" });
  }
}

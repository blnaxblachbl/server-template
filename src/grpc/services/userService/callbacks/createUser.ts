import { handleUnaryCall, status } from "@grpc/grpc-js";
import z from "zod";
import bcrypt from "bcryptjs";

import { CreateUserResponse } from "#grpc/generated/CreateUserResponse";
import { CreateUserRequest } from "#grpc/generated/CreateUserRequest";
import { getApiKeyFromGrpc } from "#utils/grpc/getApiKey";
import { prisma } from "#utils/prisma";
import { Prisma } from "#utils/prisma/generated";
import { generatePassword } from "#utils/tools/generatePassword";
import { ENV } from "#utils/config";
import { USER_FIELDS } from "#utils/constants";
import { createUserSchema } from "#utils/zod-schemas/user";

export const createUser: handleUnaryCall<
  CreateUserRequest,
  CreateUserResponse
> = async (call, callback) => {
  const { success, error, code } = await getApiKeyFromGrpc(call.metadata);
  if (!success) {
    callback({ code, details: error ?? "Something went wrong" });
    return;
  }
  const {
    success: bodySuccess,
    data,
    error: bodyError,
  } = createUserSchema.safeParse(call.request);
  if (!bodySuccess) {
    callback({
      code: status.INVALID_ARGUMENT,
      details: bodyError?.issues[0]?.message ?? "Invalid request",
    });
    return;
  }

  const generatedPassword = generatePassword();
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  if (ENV.IS_DEV) {
    console.log("password", generatedPassword);
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: USER_FIELDS,
    });
    if (!user) {
      callback({
        code: status.UNKNOWN,
        details: "Something went wrong",
      });
      return;
    }
    callback(null, {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        callback({
          code: status.INVALID_ARGUMENT,
          details: "Email already in use",
        });
        return;
      }
    }
    callback({
      code: status.INTERNAL,
      details: "Something went wrong",
    });
  }
};

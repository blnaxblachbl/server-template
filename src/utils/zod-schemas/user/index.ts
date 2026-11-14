import z from "zod";

export const createUserSchema = z.object(
  {
    name: z.string("Name is required and should be string"),
    email: z
      .string("Email is required and should be string")
      .email("Invalid email"),
  },
  "Create data is required",
);

export const updateUserSchema = z.object(
  {
    name: z.string("Name should be string").optional(),
    email: z.string("Email should be string").email("Invalid email").optional(),
  },
  "Update data is required",
);
export const loginSchema = z.object(
  {
    email: z.string("Email is required").email("Invalid email"),
    password: z.string("Password is required"),
  },
  "Login data is required",
);
export const refreshTokenSchema = z.object(
  {
    refreshToken: z.string("Refresh Token is required"),
  },
  "Refresh Token data is required",
);

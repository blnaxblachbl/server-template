import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";

import { generateAllTokens } from "#utils/token/generate";
import { UserResolvers } from "#graphql/User/types";
import { ENV } from "#utils/config";
import { setTokens } from "#utils/cookie";

export const loginUser: UserResolvers["Mutation"]["loginUser"] = async (
  _,
  { data, select },
  { prisma, req, res },
) => {
  const user = await prisma.user
    .findUnique({
      where: { email: data.email, deleted: false },
      select: {
        id: true,
        password: true,
        email: true,
        ...select?.user?.select,
      },
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
  if (
    !user ||
    user.deleted ||
    !bcrypt.compareSync(data.password, user.password)
  ) {
    throw new GraphQLError("Invalid credentials");
  }

  const tokens = generateAllTokens({
    id: user.id,
    email: user.email,
  });

  setTokens(req, res, tokens);

  return { user, ...tokens };
};

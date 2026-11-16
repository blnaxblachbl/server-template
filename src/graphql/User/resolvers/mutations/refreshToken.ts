import { GraphQLError } from "graphql";

import { generateAllTokens } from "#utils/token/generate";
import { verifyRefreshToken } from "#utils/token/verify";

import { UserResolvers } from "#graphql/User/types";
import { setTokens } from "#utils/cookie";

export const refreshToken: UserResolvers["Mutation"]["refreshToken"] = async (
  _,
  { data, select },
  { prisma, verify, refreshToken: rToken, req, res },
) => {
  if (!verify) {
    throw new Error("Unauthorized");
  }
  const token = data?.refreshToken || rToken;
  if (!token) {
    throw new Error("Refresh token is not provided");
  }
  const tokenData = verifyRefreshToken(token);
  if (!tokenData || verify.id !== tokenData.id) {
    throw new Error("Invalid refresh token");
  }
  const user = await prisma.user.findUnique({
    where: { id: tokenData.id },
    select: {
      id: true,
      email: true,
      ...select?.user?.select,
    },
  });
  if (!user) {
    throw new GraphQLError("User not found");
  }
  const tokens = generateAllTokens({
    id: user.id,
    email: user.email,
  });

  setTokens(req, res, tokens);

  return { user, ...tokens };
};

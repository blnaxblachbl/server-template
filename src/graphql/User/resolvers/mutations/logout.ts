import { UserResolvers } from "#graphql/User/types";
import { clearTokens } from "#utils/cookie";

export const logoutUser: UserResolvers["Mutation"]["logoutUser"] = async (
  _,
  __,
  { res },
) => {
  clearTokens(res);
  return true;
};

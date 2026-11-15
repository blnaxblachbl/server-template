import { UserResolvers } from "#graphql/User/types";

export const logoutUser: UserResolvers["Mutation"]["logoutUser"] = async (
  _,
  __,
  { req },
) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });
  return true;
};

import { shield, allow } from "graphql-shield";
import { GraphQLError } from "graphql";

import { userPermissions } from "./user-permissions";

export const permissions = shield(
  {
    Query: {
      ...userPermissions.Query,
    },
    Mutation: {
      ...userPermissions.Mutation,
    },
  },
  {
    allowExternalErrors: true,
    fallbackError: new GraphQLError("Forbidden"),
    fallbackRule: allow,
  },
);

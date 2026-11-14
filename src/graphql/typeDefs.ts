import { mergeTypeDefs } from "@graphql-tools/merge";

import UserTypeDefs from "#graphql/User/typeDefs";

import GlobalInputTypes from "#graphql/inputTypes";
import UserInputTypes from "#graphql/User/inputTypes";

const InputTypes = mergeTypeDefs([GlobalInputTypes, UserInputTypes]);

export default mergeTypeDefs([InputTypes, UserTypeDefs]);

import { GraphQLNonNull, GraphQLObjectType } from 'graphql/index.js';
import { userType } from './graphql-types.js';
import { CreateUserInputType } from './graphql-inputs.js';

const graphqlMutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: userType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (_, { dto }, { prisma }) => {
        return await prisma.user.create({
          data: dto,
        });
      },
    },
  },
});

export default graphqlMutations;

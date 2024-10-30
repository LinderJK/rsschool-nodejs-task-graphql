import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql/index.js';

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: GraphQLString },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});

const

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_, __, { prisma }) => {
        return await prisma.memberType.findMany();
      },
    },
    memberTypeId: {
      type: MemberType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (_, args, { prisma }) => {
        return await prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
  },
});

const RootSchema = new GraphQLSchema({
  query: RootQuery,
});

export default RootSchema;

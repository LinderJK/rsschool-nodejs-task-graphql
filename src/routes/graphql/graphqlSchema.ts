import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql/index.js';

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

// const Post = new GraphQLObjectType({
//   name: 'Post',
//   fields: {
//     id: { type: GraphQLString },
//     title: { type: GraphQLString },
//     content: { type: GraphQLString },
//   },
// });
/////////////////////////////////////////////////////////////////////////

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_, __, { prisma }) => {
        return await prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
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

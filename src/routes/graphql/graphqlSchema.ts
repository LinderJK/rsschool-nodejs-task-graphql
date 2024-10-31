import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

const memberTypeId = new GraphQLEnumType({
  name: 'memberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const memberType = new GraphQLObjectType({
  name: 'memberType',
  fields: {
    id: { type: new GraphQLNonNull(memberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const postType = new GraphQLObjectType({
  name: 'post',
  fields: {
    id: { type: UUIDType },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const userType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType,
      resolve: async (parent, _, { prisma }) => {
        return await prisma.profile.findUnique({
          where: { userId: parent.id },
          include: { memberType: true },
        });
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (parent, _, { prisma }) => {
        return await prisma.post.findMany({
          where: { userId: parent.id },
        });
      },
    },
  }),
});

const profileType = new GraphQLObjectType({
  name: 'profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: memberType,
      resolve: async (parent, _, { prisma }) => {
        return await prisma.memberType.findUnique({
          where: { id: parent.memberTypeId },
        });
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberType))),
      resolve: async (_, __, { prisma }) => {
        return await prisma.memberType.findMany();
      },
    },
    memberType: {
      type: memberType,
      args: {
        id: { type: memberTypeId },
      },
      resolve: async (_, { id }, { prisma }) => {
        return await prisma.memberType.findUnique({
          where: {
            id: id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (_, __, { prisma }) => {
        return await prisma.post.findMany();
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (_, __, { prisma }) => {
        return await prisma.user.findMany();
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(profileType))),
      resolve: async (_, __, { prisma }) => {
        return await prisma.profile.findMany();
      },
    },
  },
});

const RootSchema = new GraphQLSchema({
  query: RootQuery,
});

export default RootSchema;

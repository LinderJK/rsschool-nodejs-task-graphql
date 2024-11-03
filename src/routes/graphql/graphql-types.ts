import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/index.js';
import { UUIDType } from './types/uuid.js';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const memberType = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: {
      type: new GraphQLList(new GraphQLNonNull(profileType)),
      resolve: async (parent, _, { prisma }) => {
        return await prisma.profile.findMany({
          where: { memberTypeId: parent.id },
        });
      },
    },
  }),
});

export const profileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
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
    user: {
      type: userType,
      resolve: async (parent, _, { prisma }) => {
        return await prisma.user.findUnique({
          where: { id: parent.userId },
        });
      },
    },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
  }),
});

export const userType = new GraphQLObjectType({
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
          where: { authorId: parent.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (parent, _, { prisma }) => {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (parent, _, { prisma }) => {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        });
      },
    },
  }),
});

export const postType = new GraphQLObjectType({
  name: 'post',
  fields: {
    id: { type: UUIDType },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: userType,
      resolve: async (parent, _, { prisma }) => {
        return await prisma.user.findUnique({
          where: { id: parent.id },
        });
      },
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
      resolve: (parent) => {
        return parent.id;
      },
    },
  },
});

export const subscribersOnAuthorsType = new GraphQLObjectType({
  name: 'SubscribersOnAuthors',
  fields: {
    subscriberId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    subscriber: {
      type: userType,
      resolve: async (parent, _, { prisma }) => {
        return await prisma.user.findUnique({
          where: { id: parent.subscriberId },
        });
      },
    },
    author: {
      type: userType,
      resolve: async (parent, _, { prisma }) => {
        return await prisma.user.findUnique({
          where: { id: parent.authorId },
        });
      },
    },
  },
});

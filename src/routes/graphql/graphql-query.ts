import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql/index.js';
import { UUIDType } from './types/uuid.js';
import {
  memberType,
  MemberTypeId,
  postType,
  profileType,
  subscribersOnAuthorsType,
  userType,
} from './graphql-types.js';

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
        id: { type: MemberTypeId },
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
      args: {
        authorId: { type: UUIDType },
      },
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (_, { authorId }, { prisma }) => {
        return await prisma.post.findMany({
          where: { authorId: authorId },
        });
      },
    },
    post: {
      type: postType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, { id }, { prisma }) => {
        return await prisma.post.findUnique({
          where: {
            id: id,
          },
        });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (_, __, { prisma }) => {
        return await prisma.user.findMany();
      },
    },
    user: {
      type: userType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, { id }, { prisma }) => {
        return await prisma.user.findUnique({
          where: {
            id: id,
          },
        });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(profileType))),
      resolve: async (_, __, { prisma }) => {
        return await prisma.profile.findMany();
      },
    },
    profile: {
      type: profileType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, { id }, { prisma }) => {
        return await prisma.profile.findUnique({
          where: {
            id: id,
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(subscribersOnAuthorsType),
      args: {
        authorId: { type: UUIDType },
      },
      resolve: async (_, { authorId }, { prisma }) => {
        return prisma.subscribersOnAuthors.findMany({
          where: { authorId: authorId },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(subscribersOnAuthorsType),
      args: {
        userId: { type: UUIDType },
      },
      resolve: async (_, { userId }, { prisma }) => {
        return prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: userId },
        });
      },
    },
  },
});

export default RootQuery;

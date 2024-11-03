import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/index.js';
import { MemberTypeId, postType, profileType, userType } from './graphql-types.js';
import { UUIDType } from './types/uuid.js';
import {
  ChangePostInputType,
  ChangeProfileInputType,
  ChangeUserInputType,
  CreatePostInputType,
  CreateProfileInputType,
  CreateUserInputType,
} from './graphql-inputs.js';

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
    createPost: {
      type: postType,

      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },

      resolve: async (_, { dto }, { prisma }) => {
        return await prisma.post.create({
          data: dto,
        });
      },
    },
    createProfile: {
      type: profileType,

      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },

      resolve: async (_, { dto }, { prisma }) => {
        return await prisma.profile.create({
          data: dto,
        });
      },
    },
    changePost: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: async (_, { id, dto }, { prisma }) => {
        return await prisma.post.update({
          where: { id },
          data: dto,
        });
      },
    },
    changeProfile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: async (_, { id, dto }, { prisma }) => {
        return await prisma.profile.update({
          where: { id },
          data: dto,
        });
      },
    },
    changeUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: async (_, { id, dto }, { prisma }) => {
        return await prisma.user.update({
          where: { id },
          data: dto,
        });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        await prisma.user.delete({ where: { id } });
      },
    },
    deletePost: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        await prisma.post.delete({ where: { id } });
      },
    },
    deleteProfile: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }, { prisma }) => {
        await prisma.profile.delete({ where: { id } });
      },
    },
  },
});

export default graphqlMutations;

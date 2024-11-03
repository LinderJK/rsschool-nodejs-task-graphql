import { GraphQLSchema } from 'graphql';
import RootQuery from './graphql-query.js';
import graphqlMutations from './graphql-mutation.js';

const RootSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: graphqlMutations,
});

export default RootSchema;

import { GraphQLSchema } from 'graphql';
import RootQuery from './graphql-query.js';

const RootSchema = new GraphQLSchema({
  query: RootQuery,
});

export default RootSchema;

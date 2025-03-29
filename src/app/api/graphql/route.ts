import { gql } from "@apollo/client";

const typeDefs = gql`
  type Todo {
    id: ID!
    name: String!
    status: Status!
    createdAt: String!
    updatedAt: String!
  }
  enum Status {
    TODO
    INPROGRESS
    DONE
    BLOCKED
  }
  Query {
    
  }
`;

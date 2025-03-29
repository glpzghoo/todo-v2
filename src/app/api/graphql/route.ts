import { prisma } from "@/lib/prisma";
import { gql } from "@apollo/client";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { Status } from "@prisma/client";
import { NextRequest } from "next/server";

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
  type Query {
    alltodos: [Todo!]!
  }
  type Mutation {
    addNew(name: String!, status: String!): Todo!
    deleteTodo(id: ID!): Boolean!
    edittodo(id: ID!, status: String, name: String): Todo!
  }
`;

const resolvers = {
  Query: {
    alltodos: async () => await prisma.todo.findMany(),
  },
  Mutation: {
    addNew: async (
      pr: any,
      { name, status }: { name: string; status: Status }
    ) => await prisma.todo.create({ data: { name, status } }),
    deleteTodo: async (prev: any, { id }: { id: string }) => {
      const deletedTodo = await prisma.todo.delete({ where: { id } });
      return true;
    },
    edittodo: async (
      pre: any,
      { id, status, name }: { id: string; status: Status; name: string }
    ) =>
      await prisma.todo.update({
        where: { id },
        data: { ...(name ? { name } : {}), ...(status ? { status } : {}) },
      }),
  },
};
const server = new ApolloServer({ typeDefs, resolvers });
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

// export const GET = handler
// export const POST = handler

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

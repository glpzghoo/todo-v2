"use client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ReactNode } from "react";

const client = new ApolloClient({
  uri: "https://todo-graphql-backend.glpzghoo.space",
  cache: new InMemoryCache(),
});

export const ApolloClientProvide = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

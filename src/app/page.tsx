"use client";
import { Button } from "@/components/ui/button";
import SetCookieButton from "./components/setCookieButton";
import axios from "axios";
import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
const allUsers = gql`
  query allUsers {
    users {
      message
      code
      success
      users {
        id
        username
        todo {
          id
          description
          isDone
          priority
          taskName
        }
      }
    }
  }
`;
export default function Home() {
  const { data: users, error, loading } = useQuery(allUsers);

  if (loading) return <div>loading</div>;
  if (error) return <div>aldaa</div>;
  console.log("2", users);
  return <div className="min-h-screen"></div>;
}

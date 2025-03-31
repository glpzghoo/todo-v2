"use client";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
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

// const jwtCookie =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkpzSk9Rc19TLWg5YXdHeXdJaldrVyIsInVzZXJuYW1lIjoiZ2xwemdob28iLCJpYXQiOjE3NDM0Mzg5MjksImV4cCI6MTc0MzQ0MjUyOX0.6X3lN59O2ksDPjT9OpyEDgg_Y8KeZ7igaESucwCK_jY";
export default function Home() {
  const { data, error, loading } = useQuery(allUsers);
  // const handleClick = async () => {
  //   "use server";
  //   const cookie = await cookies();
  //   const jwt = cookie.set("accessToken", jwtCookie);
  // };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     con
  //   };
  //   fetchData();
  // }, []);
  console.log("1", data);

  if (loading) return <div>loading</div>;
  if (error) return <div>aldaa</div>;
  console.log("2", data);
  return <div className="min-h-screen"></div>;
}

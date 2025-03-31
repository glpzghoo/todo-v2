"use client";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import SetCookieButton from "./components/setCookieButton";
import axios from "axios";
import { useEffect } from "react";
// const jwtCookie =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkpzSk9Rc19TLWg5YXdHeXdJaldrVyIsInVzZXJuYW1lIjoiZ2xwemdob28iLCJpYXQiOjE3NDM0Mzg5MjksImV4cCI6MTc0MzQ0MjUyOX0.6X3lN59O2ksDPjT9OpyEDgg_Y8KeZ7igaESucwCK_jY";
export default function Home() {
  // const handleClick = async () => {
  //   "use server";
  //   const cookie = await cookies();
  //   const jwt = cookie.set("accessToken", jwtCookie);
  // };
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(
        "https://todo-graphql-backend.glpzghoo.space"
      );
      console.log(res);
    };
    fetchData();
  }, []);
  return <div className="min-h-screen"></div>;
}

"use server";

import { cookies } from "next/headers";

export default async function GETJWT(): Promise<string | boolean> {
  const cookie = await cookies();
  const accessTokenTodo = cookie.get("accessTokenTodo")?.value;
  if (!accessTokenTodo) {
    return false;
  }
  return accessTokenTodo;
}

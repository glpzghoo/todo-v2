"use server";
import { cookies } from "next/headers";

export const Logout = async (): Promise<boolean> => {
  const cookie = await cookies();
  cookie.delete("accessTokenTodo");
  return true;
};

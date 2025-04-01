"use server";
import { loginResponse } from "@/app/login/page";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function setCookie(loginResponse: loginResponse) {
  if (loginResponse) {
    const cookie = await cookies();
    cookie.set("accessTokenTodo", loginResponse.loginUser.JWT, {
      maxAge: 60 * 60,
    });
  }
}

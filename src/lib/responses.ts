import { NextResponse } from "next/server";

export const CustomNextResponse = (
  success: boolean,
  code: string,
  message: string,
  data: any,
  frontend_editing: boolean = false
): NextResponse => {
  return NextResponse.json({
    success,
    code,
    message,
    data,
    frontend_editing,
  });
};
export const NextResponse_NoEnv = (customMessage?: string): NextResponse => {
  console.error(`Missing ENV: ${customMessage || `мэдэгдэхгүй`}`);
  return NextResponse.json({
    success: false,
    code: "NO_ENV",
    message: customMessage
      ? `${customMessage} байхгүй байна. (ENV)`
      : `Серверийн тохиргооны алдаа (ENV)`,
    data: null,
    frontend_editing: false,
  });
};
export const NextResponse_NoCookie = (): NextResponse => {
  return NextResponse.json({
    success: false,
    code: "USER_NOT_SIGNED_IN",
    message: `Хэрэглэгч нэвтрээгүй байна!`,
    data: null,
    frontend_editing: false,
  });
};
export const NextResponse_CatchError = (err: unknown): NextResponse => {
  return NextResponse.json({
    success: false,
    code: "ERROR_ON_SERVER_SIDE",
    message: err instanceof Error ? err.message : String(err),
    data: null,
    frontend_editing: false,
  });
};
export const NextResponse_TokenExpired = (): NextResponse => {
  return NextResponse.json({
    success: false,
    code: "TOKEN_EXPIRED",
    message: `Token хугацаа дууссан байна. Ахин нэвтэрнэ үү!`,
    data: null,
    frontend_editing: false,
  });
};
export const NextResponse_NotAdmin = (): NextResponse => {
  return NextResponse.json({
    success: false,
    code: "UNAUTHERIZED",
    message: `Админ биш байна!`,
    data: null,
    frontend_editing: false,
  });
};

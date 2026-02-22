import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: "Guest",
    value: "true",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}

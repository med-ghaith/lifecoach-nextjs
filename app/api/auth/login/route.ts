import User from "@/database/user.model";
import { loginUser } from "@/lib/actions/user.action";
import { NextRequest, NextResponse } from "next/server";

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: Omit<typeof User, "password">;
}

// The actual API route function
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const result = await loginUser(email, password);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true, user: result.user });

  // Set HTTP-only cookie
  res.cookies.set("token", result.accessToken!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600, // 1 hour
    path: "/admin",
  });
  res.cookies.set("refreshToken", result.refreshToken!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7d
    path: "/api/auth/refresh", // only accessible in refresh endpoint
  });
  return res;
}

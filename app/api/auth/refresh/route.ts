import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "No refresh token" },
      { status: 401 }
    );
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

    // Create new access token
    const newAccessToken = jwt.sign(
      { id: (payload as any).id, email: (payload as any).email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const res = NextResponse.json({ success: true });
    res.cookies.set("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/admin", // access token is used on admin routes
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid refresh token" },
      { status: 401 }
    );
  }
}

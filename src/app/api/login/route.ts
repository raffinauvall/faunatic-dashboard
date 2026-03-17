import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (username !== adminUser || password !== adminPass) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("session", "faunaic-auth", {
    httpOnly: true,
    path: "/",
  });

  res.cookies.set("username", username, {
    path: "/",
  });

  return res;
}
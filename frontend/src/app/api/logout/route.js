import { NextResponse } from 'next/server';

export async function GET() {
  // Create a response with the cookie cleared
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set('auth_token', '', { expires: new Date(0) });
  response.cookies.set('admin_token', '', { expires: new Date(0) });

  return response;
}

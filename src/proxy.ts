import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export default auth(function middleware(req: NextRequest) {
  // auth middleware runs automatically
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
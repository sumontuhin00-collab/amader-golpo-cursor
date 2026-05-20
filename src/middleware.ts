import { NextResponse, type NextRequest } from "next/server";

export default function middleware(_request: NextRequest) {
  return NextResponse.next();
}
export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workspace/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/cart/:path*",
  ]
}



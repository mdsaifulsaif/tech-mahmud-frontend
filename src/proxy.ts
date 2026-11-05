// export { default } from "next-auth/middleware";

// export const config = {
//   matcher: ["/dashboard/:path*", "/checkout"],
// };


import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/my-orders/:path*",
    "/wishlist/:path*",
  ],
};
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;
    // Manage route protection
    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith("/login");

    const sensitiveRoutes = ["/dashboard"];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) => pathname.startsWith(route));
    if (isLoginPage) {
      if (isAuth) return NextResponse.redirect(new URL("/dashboard", req.url)); // req.url base url
      return NextResponse.next(); // should goto login
    }

    if (!isAuth && isAccessingSensitiveRoute) return NextResponse.redirect(new URL("/login", req.url));
    if (pathname === "/" && isAuth) return NextResponse.redirect(new URL("/dashboard", req.url));
  },
  {
    callbacks: {
      async authorized() {
        return true;
      }, // work-around: middleware is always called
    },
  }
);
// Middleware that checks if the user is authenticated/authorized. If if they aren't, they will be redirected to the login page. Otherwise, continue.

export const config = {
  matchter: ["/", "/login", "/dashboard/:path*"],
};

// export default withAuth(
//   async function middleware(req) {
//     const pathname = req.nextUrl.pathname;

//     // Manage route protection
//     const isAuth = await getToken({ req });
//     const isLoginPage = pathname.startsWith("/login");

//     const sensitiveRoutes = ["/dashboard"];
//     const isAccessingSensitiveRoute = sensitiveRoutes.some((route) => pathname.startsWith(route));

//     if (isLoginPage) {
//       if (isAuth) {
//         return NextResponse.redirect(new URL("/dashboard", req.url));
//       }

//       return NextResponse.next();
//     }

//     if (!isAuth && isAccessingSensitiveRoute) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     if (pathname === "/") {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }
//   },
//   {
//     callbacks: {
//       async authorized() {
//         return true;
//       },
//     },
//   }
// );

// export const config = {
//   matchter: ["/", "/login", "/dashboard/:path*"],
// };

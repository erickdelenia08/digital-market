// import { auth } from "@/lib/auth";
// import { NextRequest } from "next/server";

// export default auth((req: NextRequest & { auth: any }) => {
//   const isAuth = !!req.auth;
//   const isAuthPage =
//     req.nextUrl.pathname.startsWith("/login") ||
//     req.nextUrl.pathname.startsWith("/register") ||
//     req.nextUrl.pathname.startsWith("/forgot-password") ||
//     req.nextUrl.pathname.startsWith("/reset-password");

//   const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

//   if (isAuthPage) {
//     // If logged in, don't allow access to login/register/forgot/reset pages
//     if (isAuth) {
//       return Response.redirect(new URL("/dashboard", req.nextUrl));
//     }
//     return null;
//   }

//   // Only protect dashboard routes for now
//   if (isProtectedRoute && !isAuth) {
//     return Response.redirect(new URL("/login", req.nextUrl));
//   }
// });

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// 1. Definisikan rute berdasarkan kategori agar mudah diatur
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const protectedRoutes = ["/dashboard", "/checkout", "/profile"];
const adminRoutes = ["/dashboard"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role; // Pastikan Anda sudah memasukkan 'role' ke JWT callback
  // console.log('tessssssssss');
  // console.log('req ', req.auth);

  console.log(userRole);

  // 2. Cek tipe rute
  const isAuthRoute = authRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // 3. Logika Proteksi

  // Jika User sudah login, tidak boleh ke halaman login/register
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return null; // Izinkan akses (return null artinya biarkan request berlanjut)
  }

  // Jika mencoba akses rute Admin tapi bukan Admin
  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Jika belum login dan mencoba akses rute yang diproteksi
  if (isProtectedRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return null; // Lanjutkan request
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
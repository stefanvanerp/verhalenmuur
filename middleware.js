export function middleware(request) {
  const protectedPaths = ["/", "/admin", "/upload"];

  const pathname = request.nextUrl.pathname;

  const isProtected =
    pathname === "/" ||
    protectedPaths.some((path) =>
      pathname.startsWith(path)
    );

  // screen mag openbaar blijven
  if (pathname.startsWith("/screen")) {
    return;
  }

  if (!isProtected) {
    return;
  }

  const basicAuth = request.headers.get("authorization");

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const decodedValue = atob(authValue);
    const [user, pass] = decodedValue.split(":");

    if (user === username && pass === password) {
      return;
    }
  }

  return new Response("Inloggen vereist", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Beveiligde omgeving"',
    },
  });
}

export const config = {
  matcher: ["/", "/admin/:path*", "/upload/:path*"],
};

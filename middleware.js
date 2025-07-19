import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/home", // Redirect unauthenticated users
  },
});

export const config = {
  matcher: ["/"], // Apply middleware only to "/"
};

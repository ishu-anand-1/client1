import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Extend the default Session interface to include `id`
   */
  interface Session {
    user: {
      id: string; // Your custom property
    } & DefaultSession["user"];
  }

  /**
   * Extend the default User interface to include `id`
   */
  interface User extends DefaultUser {
    id: string; // Your custom property
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the JWT interface to include `id`
   */
  interface JWT {
    id: string; // Your custom property
  }
}

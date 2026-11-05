import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string | null;
      role?: string;
    };
  }

  interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string | null;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    id?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    error?: string;
  }
}

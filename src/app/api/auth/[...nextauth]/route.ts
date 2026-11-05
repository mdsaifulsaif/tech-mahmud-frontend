
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const REFRESH_LEAD_MS = 30_000;
const SESSION_MAX_AGE_SEC = 7 * 24 * 60 * 60;

let refreshPromise: Promise<any> | null = null;

async function refreshAccessToken(token: any) {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      if (!token.refreshToken) {
        return {
          ...token,
          accessToken: undefined,
          error: "RefreshAccessTokenError",
        };
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      });

      const result = await res.json();

      const accessToken = result?.data?.accessToken || result?.accessToken;
      const accessTokenExpires = Number(
        result?.data?.accessTokenExpires || result?.accessTokenExpires || 0
      );

      if (!res.ok || !accessToken) {
        return {
          ...token,
          accessToken: undefined,
          refreshToken: undefined,
          accessTokenExpires: 0,
          error: "RefreshAccessTokenError",
        };
      }

      const newToken = {
        ...token,
        accessToken,
        accessTokenExpires,
        error: undefined,
      };

      return newToken;
    } catch {
      return {
        ...token,
        accessToken: undefined,
        refreshToken: undefined,
        accessTokenExpires: 0,
        error: "RefreshAccessTokenError",
      };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        accessTokenExpires: { label: "Access Token Expires", type: "text" },
        userData: { label: "User Data", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.accessToken && credentials?.refreshToken) {
          let user: any = null;

          if (credentials?.userData) {
            try {
              user = JSON.parse(credentials.userData);
            } catch {
              user = null;
            }
          }

          if (!user) {
            const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/get-me`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${credentials.accessToken}`,
              },
            });

            const meResult = await meRes.json();

            if (!meRes.ok || !meResult?.data) {
              throw new Error(meResult?.message || "Could not create session");
            }

            user = meResult.data;
          }

          return {
            id: user._id || user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
            accessTokenExpires: Number(credentials.accessTokenExpires),
          };
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const result = await res.json();

        if (!res.ok || !result?.accessToken) {
          throw new Error(result?.message || "Invalid email or password");
        }

        const user = result.data;

        return {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          accessTokenExpires: Number(result.accessTokenExpires),
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SEC,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                firstName: user.name?.split(" ")[0] || "Google",
                lastName: user.name?.split(" ").slice(1).join(" ") || "User",
                googleId: account.providerAccountId,
                avatarUrl: user.image || undefined,
              }),
            }
          );

          const result = await res.json();

          if (!res.ok || !result?.accessToken) {
            return false;
          }

          (user as any).accessToken = result.accessToken;
          (user as any).refreshToken = result.refreshToken;
          (user as any).accessTokenExpires = Number(result.accessTokenExpires);
          (user as any).id = result.data._id;
          (user as any).role = result.data.role;
          (user as any).firstName = result.data.firstName;
          (user as any).lastName = result.data.lastName;

          return true;
        } catch {
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = Number((user as any).accessTokenExpires);
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        delete token.error;
        return token;
      }

      if (token.error === "RefreshAccessTokenError") {
        return token;
      }

      const expiresAt = Number(token.accessTokenExpires);

      if (expiresAt && Date.now() < expiresAt - REFRESH_LEAD_MS) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

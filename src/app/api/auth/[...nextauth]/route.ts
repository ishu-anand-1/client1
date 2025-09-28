import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import { compare } from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;
const client = new MongoClient(MONGODB_URI);
let db: any;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db();
  }
  return db;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const db = await connectDB();
          const users = db.collection("users");
          const user = await users.findOne({ email: credentials?.email });
          if (!user) throw new Error("No user found");
          const isValid = await compare(credentials!.password, user.password);
          if (!isValid) throw new Error("Invalid password");
          return { id: user._id.toString(), email: user.email, name: user.name };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
  pages: { signIn: "/login" },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

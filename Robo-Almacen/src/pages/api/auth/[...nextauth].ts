import NextAuth from "next-auth";
import { authOptions } from "rbgs/server/auth";

export default NextAuth(authOptions);

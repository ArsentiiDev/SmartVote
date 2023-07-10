import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import dbConnect from "@/lib/dbConnect";
import { compare } from "bcrypt";
import User from "@/models/User";

const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "Enter email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter Password",
                },
            },
            async authorize(credentials) {
                await dbConnect();

                // Find user with the email
                const user = await User.findOne({
                  email: credentials?.email,
                });
        
                // Email Not found
                if (!user) {
                  throw new Error("Email is not registered");
                }
                console.log('Inside Authorize')
                console.log(user.hashedPassword)
                console.log(credentials!.password)
                // Check hased password with DB hashed password
                const isPasswordCorrect = await compare(
                  credentials!.password,
                  user.hashedPassword
                );
        
                // Incorrect password
                if (!isPasswordCorrect) {
                  throw new Error("Password is incorrect");
                }
                return {
                    id: user._id.toString(),
                    name: user.username,
                    email: user.email
                }
            }
        }),
    ],
    debug: true,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async jwt({token, user}: {token:any, user:any}) {
            return token
        },
        async session({session, token}: {session:any, token:any}) {
            return session
        }
     },
    adapter: MongoDBAdapter(clientPromise),
}
export default NextAuth(authOptions as any)
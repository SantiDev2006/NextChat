import NextAuth from 'next-auth'
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from '@/lib/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'Username' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {

                // verify input exists:
                if (!credentials?.username || !credentials?.password) {
                    //throw new Error('Missing username or password');
                    return null;
                }
                
                // find user in database:
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username as string
                    }
                });

                //Reject if user doesn't exist or doesn't have a password (Google accounts)
                if(!user || !user.password) {
                    return null;
                }

                //Compare the provided password with the hashed database password
                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if(passwordMatch) {
                    return user;
                }

                return null
            }
        })
    ],

    callbacks: {
        async jwt({ token, user}) {
            if(user){
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }){
            if(token?.id && session.user){
                session.user.id = token.id as string;
            }
            return session
        }
    }
})
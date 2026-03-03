import {prismaAdapter} from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt;
import Credentials from 'next-auth/providers/credentials';
import prisma from '../../lib/prisma';

export const authOptions = {
    adapter: prismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'Enter your email' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter your password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return user;
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true
};




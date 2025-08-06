import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma/client';
import { UserRole } from '@prisma/client';
import type { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    // Credentials provider for demo/development
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@followboard.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // This is a simple demo auth - in production, you'd validate against a hashed password
        if (!credentials?.email) return null;
        
        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        // Create demo users if they don't exist
        if (!user) {
          if (credentials.email === 'wally@followboard.com') {
            user = await prisma.user.create({
              data: {
                email: 'wally@followboard.com',
                name: 'Wally',
                role: UserRole.CONTRIBUTOR,
              },
            });
          } else if (credentials.email === 'founder@followboard.com') {
            user = await prisma.user.create({
              data: {
                email: 'founder@followboard.com',
                name: 'Founder',
                role: UserRole.VIEWER,
              },
            });
          }
        }
        
        return user;
      },
    }),
    // Google Provider (optional)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    // GitHub Provider (optional)
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = user?.id || token.sub!;
        session.user.role = user?.role || UserRole.CONTRIBUTOR;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
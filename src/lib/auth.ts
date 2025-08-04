import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations/auth';

const nextAuth = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
    error: '/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          const isPasswordValid = await compare(password, user.passwordHash);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.profile?.displayName || user.username,
            image: user.profile?.avatar || undefined,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
      }

      // Handle OAuth sign-ups
      if (account?.provider && account.provider !== 'credentials') {
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email! },
          include: { profile: true },
        });

        if (existingUser) {
          token.username = existingUser.username;
          token.role = existingUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account, profile: _profile }) {
      if (account?.provider === 'credentials') {
        return true;
      }

      // Handle OAuth providers
      if (
        account?.provider &&
        (account.provider === 'google' || account.provider === 'github')
      ) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Generate username from email or profile
            let username = user.email!.split('@')[0];

            // Check if username already exists and make it unique
            const existingUsername = await prisma.user.findUnique({
              where: { username },
            });

            if (existingUsername) {
              username = `${username}_${Math.random().toString(36).substr(2, 4)}`;
            }

            // Create user with profile
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                username,
                emailVerified: new Date(),
                profile: {
                  create: {
                    displayName: user.name || username,
                    avatar: user.image,
                  },
                },
              },
            });

            user.username = newUser.username;
            user.role = newUser.role;
          }

          return true;
        } catch (error) {
          console.error('OAuth sign in error:', error);
          return false;
        }
      }

      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Create a profile for new users
      if (!user.name && user.id) {
        await prisma.profile.create({
          data: {
            userId: user.id,
            displayName:
              (user as { username?: string }).username ||
              user.email?.split('@')[0] ||
              'User',
          },
        });
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

export const { handlers, auth, signIn, signOut } = nextAuth;

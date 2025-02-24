import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from './mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter an email and password');
          }

          await connectDB();
          
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          }).select('+password');
          
          if (!user) {
            console.log('No user found with email:', credentials.email);
            throw new Error('Invalid email or password');
          }

          if (!user.password) {
            console.log('User has no password set:', user.email);
            throw new Error('Invalid login method');
          }

          const isValid = await user.comparePassword(credentials.password);
          if (!isValid) {
            console.log('Invalid password for user:', user.email);
            throw new Error('Invalid email or password');
          }

          console.log('User authenticated successfully:', user.email);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}; 
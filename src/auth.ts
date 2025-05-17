import GitHub from '@auth/core/providers/github';
import { defineConfig } from 'auth-astro';

// Define environment variables for type safety
// In a real project, these would be set in .env
// GitHub OAuth credentials would be obtained from GitHub Developer settings
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'mock-client-id';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'mock-client-secret';

// Define the auth configuration
export const authConfig = defineConfig({
  providers: [
    GitHub({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET || 'your-auth-secret-key',
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // You can also add additional user data here from your database
      }
      return session;
    },
  },
});

// Helper URLs for the component to use
export const signIn = () => '/api/auth/signin';
export const signOut = () => '/api/auth/signout';

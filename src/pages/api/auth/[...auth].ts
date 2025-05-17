import { authConfig } from '../../../auth';
import { defineMiddleware } from 'auth-astro/middleware';

// Create and export the API routes from the auth config
export const { GET, POST } = defineMiddleware(authConfig);

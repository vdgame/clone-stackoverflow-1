// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import auth from 'auth-astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    auth(),
  ],
  server: {
    host: '0.0.0.0', // Allow connections from all network interfaces
  },
  adapter: netlify(),
  output: 'server',
});

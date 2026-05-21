// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // 'static' for local dev/build without Netlify; switch to 'hybrid' when deploying to Netlify
  // so that static pages are pre-rendered and API routes run as Netlify Functions.
  output: 'static',
  adapter: netlify(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});

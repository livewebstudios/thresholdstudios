// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thresholdstudios-demo.netlify.app',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [
    react(),
    sitemap({ filter: (page) => !page.includes('/dev/') && !page.includes('/404') }),
  ],
  image: { responsiveStyles: false },
  devToolbar: { enabled: false },
});

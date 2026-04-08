// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://aimachine.pl',
  trailingSlash: 'always',
  output: 'static',
  i18n: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

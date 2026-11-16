/* global process */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawSiteUrl =
    env.VITE_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://jp-dev-info.vercel.app');
  const siteUrl = rawSiteUrl.replace(/\/+$/, '');

  return {
    plugins: [
      react(),
      {
        name: 'html-site-url-transform',
        transformIndexHtml(html) {
          return html.replace(/%SITE_URL%/g, siteUrl);
        },
      },
    ],
  };
});

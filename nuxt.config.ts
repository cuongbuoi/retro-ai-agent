// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-09',
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@pinia/nuxt', '@nuxtjs/i18n'],
  // Disable SSR for Edge Functions to avoid document reference errors
  ssr: false,
  nitro: {
    preset: 'vercel',
  },
  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'user-locale',
      redirectOn: 'root',
      alwaysRedirect: true,
    },
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'vi',
        name: 'Tiếng Việt',
        file: 'vi.json',
      },
    ],
  },
  routeRules: {
    // API routes must use SSR even with client-side app
    '/api/**': {
      ssr: true,
    },
    '/examples/*': { redirect: '/redirect-route' },
    '/modify-headers-route': { headers: { 'x-magic-of': 'nuxt and vercel' } },
    // Enables client-side rendering
    '/spa': { ssr: false },
  },
  devServer: {
    port: process.env.NUXT_PORT ? parseInt(process.env.NUXT_PORT) : 6868,
  },
  runtimeConfig: {
    GEMINI_API_KEY: process.env.NUXT_GEMINI_API_KEY, // Using API key from .env file
    SEARCH_API_KEY: process.env.NUXT_SEARCH_API_KEY, // Google Search API key
    SEARCH_ENGINE_ID: process.env.NUXT_SEARCH_ENGINE_ID, // Google Custom Search Engine ID
  },
  app: {
    head: {
      title: 'Retro AI Agent Chatbot',
      meta: [
        {
          name: 'description',
          content:
            'Retro AI Agent Chatbot is a agent that uses AI to answer questions and help you with your problems.',
        },
        {
          name: 'keywords',
          content: 'Retro AI Agent Chatbot, AI, Chatbot, Agent, Retro, AI Agent, AI Chatbot, AI Agent Chatbot',
        },
        {
          name: 'author',
          content: 'Cường Buôi',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})

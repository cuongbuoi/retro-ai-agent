// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-09',
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  // Disable SSR for Edge Functions to avoid document reference errors
  ssr: false,
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  devServer: {
    port: process.env.NUXT_PORT ? parseInt(process.env.NUXT_PORT) : 6868,
  },
  runtimeConfig: {
    GEMINI_API_KEY: process.env.NUXT_GEMINI_API_KEY, // Using API key from .env file
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

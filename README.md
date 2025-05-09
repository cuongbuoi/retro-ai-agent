# AI Chatbot with Gemini API

This is a chatbot application built with Nuxt.js that uses Google's Gemini API for generating AI responses.

## Setup

1. Clone the repository
2. Make sure you have Node.js 22 or later installed
   ```bash
   node --version # Should output v22.x.x or later
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/)
5. Create a `.env` file in the root directory with the following content:
   ```
   NUXT_GEMINI_API_KEY=your_gemini_api_key_here
   ```
6. Run the development server
   ```bash
   npm run dev
   ```

## Features

- Multiple agent personalities (customerSupport, facebook, twitter)
- Customizable system prompts
- Responsive UI

## Chatbot Agent System

The application uses a system of "agents" that define the personality and behavior of the chatbot. These agents are defined in the `agents` directory.

### Available Agents

- `customerSupportAgent`: Provides customer support for a fictional "Social Media Post Generator" application
- `facebookAgent`: Specialized in creating Facebook-style posts
- `twitterAgent`: Specialized in creating Twitter-style posts

### Creating a New Agent

To create a new agent, add a new file in the `agents` directory following the pattern of the existing agents.

## Technology Stack

- [Nuxt.js](https://nuxt.com/)
- [Google Gemini API](https://ai.google.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

## License

MIT

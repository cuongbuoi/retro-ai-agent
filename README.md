# Retro AI Agent Assistant

This is a flexible AI assistant platform to support multiple specialized AI agents. The system currently features a frontend development expert and can be easily extended with additional agents for different domains and specialties.

## Setup

1. Clone the repository
2. Make sure you have Node.js 22 or later installed
   ```bash
   node --version # Should output v22.x.x or later
   ```
3. Install dependencies
   ```bash
   yarn install
   ```
4. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/)
5. Create a `.env` file in the root directory with the following content:
   ```
   NUXT_GEMINI_API_KEY=your_gemini_api_key_here
   ```
6. Run the development server
   ```bash
   yarn dev
   ```

## Available Scripts

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Generate static site
yarn generate

# Preview production build
yarn preview

# Prepare Nuxt
yarn postinstall

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Format code with Prettier
yarn format

# Check formatting
yarn format:check
```

## Features

- Expert frontend development assistance
- Multilingual support (English and Vietnamese)
- Customizable system prompts
- Responsive UI

## Chatbot Agent System

The application uses a system of "agents" that define the personality and behavior of the AI assistant. These agents are defined in the `agents` directory.

### Available Agents

- `frontendDeveloperAgent`: An expert frontend developer with 15 years of experience across various frontend technologies and frameworks. Provides guidance on:

  - Modern JavaScript/TypeScript, HTML, and CSS
  - Frontend frameworks (React, Vue, Angular, Svelte)
  - Component design patterns and best practices
  - Performance optimization techniques
  - AI integration in frontend applications

- `backendDeveloperAgent`: A senior backend developer with 20 years of experience across various backend technologies and frameworks. Provides guidance on:
  - Server-side languages (Node.js, Python, Java, Go, PHP, C#)
  - Database systems (SQL, NoSQL, GraphQL)
  - API design and implementation
  - Microservices architecture
  - Cloud services and DevOps
  - Performance optimization and scaling
  - Security best practices

### Creating a New Agent

To create a new agent, add a new file in the `agents` directory and register it in the `agents/index.ts` file.

## Technology Stack

- [Nuxt](https://nuxt.com/)
- [Google Gemini API](https://ai.google.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

## License

MIT

## Deployment to Vercel

This project is configured for easy deployment on Vercel. Follow these steps to deploy:

1. Create a Vercel account if you don't have one already at [vercel.com](https://vercel.com)
2. Install the Vercel CLI: `npm install -g vercel`
3. Run `vercel login` and follow the instructions to log in
4. In the project directory, run `vercel` to deploy
5. Follow the prompts in the CLI

### Environment Variables

Make sure to set these environment variables in your Vercel project settings:

- `NUXT_GEMINI_API_KEY`: Your Google Gemini API key

### Build Settings

The project is already configured with:

- Build Command: `npm run generate`
- Output Directory: `.output/public`

These settings are defined in the `vercel.json` file.

### Automated Deployment with GitHub Actions

This project includes a GitHub Actions workflow that automatically deploys to Vercel when changes are pushed to the main branch.

To set up automated deployment:

1. In your GitHub repository, go to Settings > Secrets and variables > Actions
2. Add the following repository secrets:
   - `VERCEL_TOKEN`: Your Vercel personal access token (create at https://vercel.com/account/tokens)
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `NUXT_GEMINI_API_KEY`: Your Google Gemini API key

To find your Vercel project ID and organization ID, run:

```bash
vercel project ls
vercel whoami
```

Or check the `.vercel/project.json` file after running `vercel` once locally.

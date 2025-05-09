# Technical Context

## Technology Stack

The Retro AI Agent Assistant is built using the following technologies:

### Core Framework

- **Nuxt 3**: Modern Vue.js framework providing server-side rendering, file-based routing, and TypeScript integration
- **Vue 3**: Progressive JavaScript framework with Composition API for building the UI
- **TypeScript**: For type safety and improved developer experience

### Styling and UI

- **TailwindCSS**: Utility-first CSS framework for styling
- **DaisyUI**: Component library built on top of Tailwind for additional UI components
- **Custom Pixel Art Styling**: Custom CSS for retro pixel-art aesthetic

### AI Integration

- **Google Gemini API**: Large language model API for generating AI responses
- **@google/genai**: Official JavaScript client for the Gemini API

### Build and Development

- **Node.js**: JavaScript runtime (v22+)
- **Yarn**: Package manager
- **ESLint/Prettier**: Code quality and formatting tools

## Development Environment

- **Node.js v22+**: Required for running the application
- **Yarn 1.22.19+**: Package manager
- **.env file**: Contains the Gemini API key
- **Modern web browser**: For testing and development

## API Integration

The application integrates with the Google Gemini API for AI functionality:

1. User messages are sent to the server-side API route
2. The server sends requests to Gemini API with agent-specific prompts
3. Responses are streamed back to the client in real-time
4. The client renders the streaming responses in the UI

## Deployment

The application is configured for deployment on several platforms:

### Vercel

- Build Command: `npm run generate`
- Output Directory: `.output/public`
- Environment Variables: `NUXT_GEMINI_API_KEY`

### Netlify

- Configuration in `netlify.toml`
- Same environment variable requirements

## Technical Constraints

1. **API Rate Limits**: Gemini API has rate limits that need to be respected
2. **Browser Compatibility**: Modern browsers supporting ES6+ features are required
3. **API Key Security**: Gemini API key must be kept secure and not exposed in client-side code
4. **Response Streaming**: Relies on browser support for streaming responses

## Technical Debt and Considerations

1. **Error Handling**: Comprehensive error handling for API failures
2. **Caching**: Consider implementing caching for responses to reduce API usage
3. **Testing**: Add unit and integration tests for components and API interactions
4. **Offline Support**: Consider adding offline functionality with service workers
5. **Accessibility**: Ensure UI is accessible despite the retro styling

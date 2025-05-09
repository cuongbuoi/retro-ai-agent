# Technical Context

## Technologies Used

### Frontend

- **Nuxt.js 3**: Full-stack framework for Vue.js
- **Vue.js 3**: Progressive JavaScript framework for building UIs
- **TypeScript**: Typed JavaScript for better code quality
- **TailwindCSS**: Utility-first CSS framework
- **vue3-markdown**: Markdown rendering component
- **nanoid**: Unique ID generation
- **FileReader API**: Used for client-side file reading and processing

### Backend

- **Edge Runtime**: For server-side streaming response handling
- **Nuxt API Routes**: Server endpoints for AI communication
- **Google Gemini API**: AI model service for generating responses
- **Server-Sent Events (SSE)**: Protocol for streaming real-time updates

### AI Services

- **Google Gemini 2.0 Flash**: Advanced AI model for text generation with multilingual support

### Localization

- **Nuxt i18n (planned)**: For future systematic localization
- **Custom text replacements**: Current approach for Vietnamese localization
- **SVN-Retron font**: Custom font with support for Vietnamese characters

## Development Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- GEMINI_API_KEY from Google AI Studio

### Installation

1. Clone the repository
2. Install dependencies with `npm install` or `yarn`
3. Copy `.env.example` to `.env` and add your GEMINI_API_KEY
4. Run the development server with `npm run dev`

## Key Technical Decisions

### 1. Streaming Responses

We use Server-Sent Events (SSE) for streaming AI responses in real-time, providing a responsive user experience without waiting for complete responses.

### 2. Edge Runtime

The API routes use Vercel Edge Runtime for optimal handling of streaming responses, with fallbacks for other environments.

### 3. Component Architecture

We've adopted a modular component architecture with Vue 3's Composition API for better organization and reusability.

### 4. Retro Styling

The pixel art styling is implemented through CSS and TailwindCSS, with careful attention to maintaining consistent styling across all components.

### 5. File Processing

File handling is implemented on the client side to minimize server load:

- FileReader API for reading files as base64/text
- Different handling for various file types (images, text, PDFs)
- Client-side processing before sending to the API
- Using the Gemini API's multimodal capabilities for processing images

### 6. Localization Approach

The application supports both English and Vietnamese with a hybrid approach:

- Direct text replacements for static UI elements
- Vietnamese-focused styling to accommodate longer text
- Cultural adaptation of UI elements and expressions
- Plans for a more systematic i18n implementation in future releases

## Technical Constraints

### API Limitations

- Gemini API has token limits that may affect very long conversations
- API key security must be maintained via server-side processing
- Streaming responses require specific handling for different environments

### Browser Compatibility

- The application targets modern browsers with ES6+ support
- Some features like `image-rendering: pixelated` may have varying support across browsers
- Font rendering for Vietnamese characters may vary across platforms

### Performance Considerations

- Large files may impact performance due to base64 encoding
- Client-side file processing may be resource-intensive for large files
- No current limitation on file size or number of attachments
- Vietnamese text may require additional rendering considerations

## Integration Points

### Google Gemini API

The application integrates with the Google Gemini API for AI capabilities:

- Using the official @google/genai TypeScript SDK
- Implementing streaming with generateContentStream
- Supporting both text and image inputs through content parts
- Leveraging Gemini's multilingual capabilities for Vietnamese support

### Deployment Platforms

The application is configured for deployment on:

- Vercel (with Edge Functions support)
- Netlify (with Edge Functions support)

## Testing Strategy

- Component testing with Vue Test Utils
- End-to-end testing with Cypress (planned)
- Manual testing for AI interaction quality
- Localization testing for Vietnamese content and layout

## Security Considerations

- API keys are secured server-side
- No sensitive data is stored client-side
- File uploads are processed client-side to avoid storage concerns
- Input validation to prevent injection attacks

## Monitoring and Logging

- Basic error logging implemented
- More comprehensive monitoring planned for production
- Localization issues tracking

## Future Technical Improvements

- Implement proper i18n framework for systematic localization
- Add caching mechanism for API responses
- Optimize file handling for large files
- Improve error recovery mechanisms
- Implement comprehensive testing suite

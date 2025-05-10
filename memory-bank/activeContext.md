# Active Context

## Current Focus

We are enhancing the chat application's capabilities by adding file upload and analysis functionality while also improving the Vietnamese localization. This allows users to share files with the AI assistant for analysis and interpretation, expanding the usefulness of the application beyond text-based interactions.

The main components have been implemented, including:

1. The agent selection interface in the header
2. The chat interface for communication with AI agents
3. Three specialized AI agents (Frontend, Backend, Product Manager)
4. Integration with the Google Gemini API
5. File upload and analysis support
6. Deep Research capabilities with web search integration
7. API key management in the settings page
8. Master Novelist agent for storytelling and creative writing

### API Key Management Implementation

We have added a new API key management section to the settings page, allowing users to:

1. Enter and save their own API keys for Gemini and Google Search
2. Get information about where to obtain the required API keys
3. Reset the stored API keys if needed

The implementation includes:

- A new Pinia store (apiKeysStore) to manage API key storage in localStorage
- Integration with the existing settings page UI
- Modifications to the AI and search utilities to use client-side keys when available
- Proper localization for both English and Vietnamese
- Links to the appropriate Google services to obtain the API keys

### Deep Research Feature Implementation

We have added a new AI agent called "Giáo sư Đạt Vân Tây" (Deep Research Expert) that specializes in providing comprehensive research capabilities. This new agent can:

1. Automatically search the web for information relevant to the user's query
2. Analyze and synthesize information from multiple sources
3. Present well-organized, structured responses with cited sources
4. Handle complex research questions with depth and accuracy

The implementation includes:

- A new agent definition in `agents/deepResearchAgent.ts`
- Integration with web search APIs via Google Custom Search
- A streaming search experience that shows the research process
- A specialized UI component to showcase this feature
- Vietnamese-focused UI and agent personality

### Novelist Agent Implementation

We have added a new AI agent called "Hoàng Minh Phúc" (Master Novelist) that specializes in creative writing and storytelling. This new agent can:

1. Craft engaging narratives with rich character development and vivid descriptions
2. Provide advice on story structure, plot development, and character creation
3. Write captivating prose with a fluid, rhythmic style inspired by Vietnamese literary traditions
4. Assist users with their creative writing projects and storytelling challenges

The implementation includes:

- A new agent definition in `agents/novelistAgent.ts`
- Integration with the existing agent system
- A Vietnamese-focused writing style with authentic cultural elements
- Example responses showcasing the agent's writing abilities in the wuxia/martial arts genre
- Rich, descriptive language that creates immersive scenes and characters

### Integration Points

The Deep Research feature integrates with the existing app through:

- Agent registration in constants/agents.ts and agents/index.ts
- Web search functionality in utils/search.ts
- API enhancements in server/api/ai.ts to support search and streaming
- UI component in components/DeepResearchFeature/DeepResearchFeature.vue

## Recent Changes

- Implemented the core UI with retro pixel art styling
- Set up the agent selection dropdown
- Created the chat interface with message streaming
- Added three specialized agents with different expertise
- Configured deployment settings for Vercel and Netlify
- Implemented file upload functionality in the chat interface
- Added support for processing images, text files, and PDFs
- Modified API handling to process file content along with text messages
- Updated UI to include file upload button and file display in chat bubbles
- Added file processing indicators to improve user experience
- Fixed UI layout issues with file uploads:
  - Fixed issue where file uploads would push the input box off-screen
  - Made the chat footer sticky to ensure it stays visible
  - Improved scrolling behavior to accommodate file attachments
  - Ensured proper responsive layout on various screen sizes
- Enhanced Vietnamese localization:
  - Changed "Trò chuyện cùng" to "Tán gẫu cùng" in the chat header
  - Renamed the user persona from "You" to "Thằng Bảy"
  - Translated UI elements for file uploads and processing status
  - Updated typing indicators to use Vietnamese language patterns
  - Added Vietnamese label for agent selection
  - Improved UI styling for better Vietnamese text display
- Enhanced the PixelButton component:
  - Added a disabled state property to control button interactivity
  - Implemented styling for disabled buttons (reduced opacity, grayscale effect)
  - Added proper handling for disabling click events when in disabled state
  - Ensured the hover and active effects don't trigger on disabled buttons
- Added Deep Research feature:
  - Implemented a new agent "Giáo sư Đạt Vân Tây" for comprehensive research
  - Created web search integration using Google Custom Search API
  - Developed streaming search experience with real-time updates
  - Added a dedicated UI component to promote the Deep Research feature
  - Integrated search results into AI prompts for better context

## Next Steps

The following items are prioritized for upcoming work:

1. **Enhance Chat Experience**:

   - Add typing indicators
   - Implement message history persistence
   - Support for code formatting and syntax highlighting
   - Complete Vietnamese localization across all UI elements

2. **Agent Improvements**:

   - Refine agent prompts for better responses
   - Add more training examples to improve handling of edge cases
   - Consider adding more specialized agents (DevOps, UX designer, etc.)

3. **UI Enhancements**:

   - Add more retro-themed visual elements
   - Implement responsive design for mobile devices
   - Add animations for message transitions

4. **Technical Improvements**:

   - Implement caching to reduce API calls
   - Add comprehensive error handling
   - Set up unit and integration tests

5. **File Upload Improvements**:

   - Add file size limitations to prevent performance issues
   - Implement more robust error handling for failed uploads
   - Optimize file processing for large files
   - Add support for more file formats

6. **Deep Research Enhancements**:

   - Add document analysis capabilities to process uploaded files
   - Implement memory for maintaining context across research sessions
   - Add support for academic/scientific research with citation formats
   - Create visualization tools for research insights
   - Add fallback mechanisms for when search API is unavailable
   - Implement search filtering options for more targeted results

## Active Decisions and Considerations

1. **Agent Personalities**: Deciding how distinct each agent's personality should be while maintaining professionalism and helpfulness
2. **Multilingual Support**: Enhancing Vietnamese language support with colloquial terms and natural expressions
3. **Response Quality**: Monitoring and improving the quality of AI responses for technical accuracy and helpfulness
4. **Performance Optimization**: Considering ways to optimize streaming and rendering performance for smooth user experience
5. **User Feedback**: Planning to implement a feedback mechanism to improve agent responses over time
6. **Search API Management**: Handling API rate limits and keys for the Google Custom Search integration

### Localization Strategy

We're implementing a comprehensive Vietnamese localization approach:

- Using colloquial Vietnamese terms to create a more engaging and authentic experience
- Adapting the interface to match Vietnamese language patterns and expressions
- Maintaining the character and personality of the assistant (Đạt Văn Tây) in Vietnamese context
- Creating consistent terminology across the application

### File Handling Strategy

We're using a client-side approach to file handling:

- Files are read and converted to appropriate formats (base64 for images, text for documents)
- File contents are sent along with the message to the AI service
- The Gemini API processes both text content and file data in the same request

This approach minimizes server load since files are processed on the client side before being sent to the API. However, it does increase the payload size for API requests, which could impact performance for very large files.

### Search Integration Strategy

For the Deep Research feature, we've implemented a web search integration that:

- Uses the Google Custom Search API to perform web searches
- Streams search status updates to the user in real-time
- Formats search results into a structured format for the AI model
- Enhances the AI prompt with relevant web information
- Maintains Vietnamese language compatibility throughout the process

### UX Considerations

- Added file attachment previews in chat bubbles to provide visual confirmation
- Implemented loading indicators during file processing to keep users informed
- Maintained the retro pixel styling for all new UI elements
- Made sure file attachment interface is intuitive and consistent with the existing design
- Fixed layout issues to ensure the interface is always usable regardless of file upload status
- Enhanced button and UI element sizes for better usability
- Used culturally appropriate Vietnamese phrases and expressions
- Added search progress indicators for the Deep Research feature
- Designed the Deep Research feature UI to match the retro aesthetic

### Technical Debt

Current implementation has some limitations:

- Very large files might cause performance issues
- Limited error handling for failed uploads or incompatible files
- File processing is synchronous and might block the UI thread for large files
- No current limitation on file size or number of attachments
- Incomplete Vietnamese localization in some dynamic content sections
- Search API keys need secure management and rate limiting
- Error handling for search failures needs improvement
- No caching mechanism for search results

These issues will be addressed in future iterations as we continue to develop and refine the application.

## Current Challenges

1. **API Rate Limits**: Managing Google Gemini API and Google Search API rate limits, especially during development and testing
2. **Response Time**: Optimizing response time while maintaining quality of AI-generated content
3. **Balance of Personality vs. Utility**: Finding the right balance between agent personality and technical utility
4. **Edge Cases**: Handling various edge cases in user queries and agent responses
5. **Testing Strategy**: Developing an effective testing strategy for AI-driven applications
6. **Cultural Adaptation**: Ensuring the Vietnamese version maintains cultural relevance and natural language patterns
7. **Search Quality**: Ensuring search results are relevant and helpful for the user's query

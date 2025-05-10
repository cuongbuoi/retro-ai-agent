// Vercel Edge Runtime to enable streaming
export const runtime = 'edge'
import { getQuery, readBody, setResponseHeaders } from 'h3'
import {
  MODEL_NAME,
  DEFAULT_AGENT,
  initializeAIClient,
  prepareAIContents,
  sendSSE,
  sendError,
  isValidAgent,
  getAgentConfig,
  buildPrompt,
  streamResponse,
  performWebSearchAndStream,
} from '@/utils'
import type { TextPart } from '@/utils'

/**
 * Main API handler for AI chat functionality
 * Supports streaming responses via Server-Sent Events
 */
export default defineEventHandler(async (event) => {
  // Set up SSE response
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  const response = event.node.res
  const isVercel = process.env.VERCEL === '1'

  try {
    // Parse and validate request
    const body = await parseRequestBody(event)
    if (!body) return

    // Setup agent and AI client
    const agentName = body.agent || DEFAULT_AGENT
    if (!isValidAgent(agentName)) {
      return sendError(response, `Agent '${agentName}' doesn't exist`)
    }

    const aiClient = initializeAIClient()
    const agentConfig = getAgentConfig(agentName, body)
    const prompt = buildPrompt(body.messages || [], agentConfig.messages)

    // Process files if present
    const contents = await prepareAIContents(prompt, body.messages)

    // Begin streaming response
    sendSSE(response, { type: 'start' })

    // For deep research agent, perform web search if appropriate
    if (agentName === 'deepResearchAgent' && body.messages && body.messages.length > 0) {
      // Get the last user message to use as search query
      const lastUserMessage = body.messages[body.messages.length - 1]
      if (lastUserMessage.role === 'user') {
        const query = lastUserMessage.content
        // Perform web search and get formatted results
        const searchResults = await performWebSearchAndStream(query, response)

        // Append search results to the prompt if we have text part
        if (searchResults && contents.length > 0 && 'text' in contents[0].parts[0]) {
          const textPart = contents[0].parts[0] as TextPart
          textPart.text = `${textPart.text}\n\n${searchResults}`
        }
      }
    }

    // Stream AI response
    await streamResponse(aiClient, contents, response, isVercel)

    response.end()
  } catch (error: any) {
    sendError(response, error.message || 'Unknown error')
  }
})

/**
 * Parse request body from either GET or POST method
 */
async function parseRequestBody(event: any) {
  const response = event.node.res
  const method = event.node.req.method

  if (method === 'GET') {
    const query = getQuery(event)
    if (!query.data) {
      sendError(response, 'Missing data parameter')
      return null
    }

    try {
      return JSON.parse(atob(query.data as string))
    } catch (e) {
      sendError(response, 'Invalid data parameter')
      return null
    }
  } else {
    return await readBody(event)
  }
}

<script setup lang="ts">
import type { Message, User } from '../../types'
import { nanoid } from 'nanoid'

const props = defineProps<{
  agent?: string
}>()

const me = ref<User>({
  id: 'user',
  avatar: '/user.png',
  name: 'You',
})
const bot = ref<User>({
  id: 'assistant',
  avatar: '/bot.png',
  name: 'Đạt Văn Tây',
})

const users = computed(() => [me.value, bot.value])

const messages = ref<Message[]>([])
const streamingMessage = ref<Message | null>(null)
const usersTyping = ref<User[]>([])

// send messages to Chat API here
// and in the empty function below

const messagesForApi = computed(() =>
  messages.value
    .map((m) => ({
      role: m.userId,
      content: m.text,
    }))
    .slice(-2),
)

async function handleNewMessage(message: Message) {
  messages.value.push(message)
  usersTyping.value.push(bot.value)

  // Create an initial streaming message
  streamingMessage.value = {
    id: nanoid(),
    userId: bot.value.id,
    createdAt: new Date(),
    text: '',
  }

  try {
    // Use fetch for POST request with streaming
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        messages: messagesForApi.value,
        ...(props.agent && { agent: props.agent }),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Get reader from response body
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No readable stream available')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // Decode and append to buffer
      buffer += decoder.decode(value, { stream: true })

      // Process complete SSE messages
      const messageChunks = buffer.split('\n\n')
      // Keep the last potentially incomplete message in the buffer
      buffer = messageChunks.pop() || ''

      for (const messageText of messageChunks) {
        if (messageText.trim() === '') continue

        // Parse SSE message
        if (messageText.startsWith('data: ')) {
          try {
            const data = JSON.parse(messageText.substring(6))

            if (data.type === 'start') {
              // Stream started
              console.log('Stream started')
            } else if (data.type === 'chunk') {
              // Add chunk to streaming message
              if (streamingMessage.value && data.content) {
                streamingMessage.value.text += data.content
              }
            } else if (data.type === 'complete') {
              // Stream complete
              if (data.message && data.message.choices && data.message.choices[0].message) {
                const finalMessage = {
                  id: data.message.id || nanoid(),
                  userId: bot.value.id,
                  createdAt: new Date(),
                  text: data.message.choices[0].message.content,
                }

                // Replace streaming message with final message
                const index = messages.value.findIndex(
                  (m) => streamingMessage.value && m.id === streamingMessage.value.id,
                )
                if (index !== -1) {
                  messages.value[index] = finalMessage
                } else {
                  messages.value.push(finalMessage)
                }

                // Clear streaming message
                streamingMessage.value = null
              }
            } else if (data.type === 'error') {
              // Handle error
              console.error('Streaming error:', data.error)
              if (streamingMessage.value) {
                streamingMessage.value.text += `\n\nError: ${data.error}`
              }
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e)
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming request failed:', error)
    if (streamingMessage.value) {
      streamingMessage.value.text = 'Error: Failed to connect to the AI service.'
    }
  } finally {
    usersTyping.value = []
  }
}
</script>
<template>
  <ChatBox
    :me="me"
    :users="users"
    :messages="streamingMessage ? [...messages, streamingMessage] : messages"
    @new-message="handleNewMessage"
    :usersTyping="usersTyping"
  />
</template>

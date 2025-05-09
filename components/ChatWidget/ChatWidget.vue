<script setup lang="ts">
import type { Message, User } from '../../types'
import { nanoid } from 'nanoid'

// Props
const props = defineProps<{
  agent?: string
}>()

// Define users
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

// Chat state
const messages = ref<Message[]>([])
const streamingMessage = ref<Message | null>(null)
const usersTyping = ref<User[]>([])

// Format messages for API - only send last 2 messages to reduce payload size
const messagesForApi = computed(() =>
  messages.value
    .map((m) => ({
      role: m.userId,
      content: m.text,
    }))
    .slice(-2),
)

// Process SSE data events
const processSSEData = (data: any) => {
  switch (data.type) {
    case 'start':
      console.log('Stream started')
      break

    case 'chunk':
      if (streamingMessage.value && data.content) {
        streamingMessage.value.text += data.content
      }
      break

    case 'complete':
      if (data.message?.choices?.[0]?.message) {
        const finalMessage = {
          id: data.message.id || nanoid(),
          userId: bot.value.id,
          createdAt: new Date(),
          text: data.message.choices[0].message.content,
        }

        // Replace streaming message with final message
        const index = messages.value.findIndex((m) => streamingMessage.value && m.id === streamingMessage.value.id)

        if (index !== -1) {
          messages.value[index] = finalMessage
        } else {
          messages.value.push(finalMessage)
        }

        streamingMessage.value = null
      }
      break

    case 'error':
      console.error('Streaming error:', data.error)
      if (streamingMessage.value) {
        streamingMessage.value.text += `\n\nError: ${data.error}`
      }
      break
  }
}

// Process SSE stream chunks
const processStreamChunk = (buffer: string, decoder: TextDecoder, chunk: Uint8Array) => {
  // Append new decoded text to buffer
  const newBuffer = buffer + decoder.decode(chunk, { stream: true })

  // Split buffer into complete messages
  const messageChunks = newBuffer.split('\n\n')

  // Keep the last potentially incomplete chunk in buffer
  const remainingBuffer = messageChunks.pop() || ''

  // Process all complete messages
  for (const messageText of messageChunks) {
    if (messageText.trim() === '') continue

    if (messageText.startsWith('data: ')) {
      try {
        const data = JSON.parse(messageText.substring(6))
        processSSEData(data)
      } catch (e) {
        console.error('Error parsing SSE data:', e)
      }
    }
  }

  return remainingBuffer
}

// Handle new message submission
async function handleNewMessage(message: Message) {
  // Add user message to chat
  messages.value.push(message)
  usersTyping.value.push(bot.value)

  // Create placeholder for streaming response
  streamingMessage.value = {
    id: nanoid(),
    userId: bot.value.id,
    createdAt: new Date(),
    text: '',
  }

  try {
    // Fetch API response as stream
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

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No readable stream available')

    // Process stream
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer = processStreamChunk(buffer, decoder, value)
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

<script setup lang="ts">
import { useApiKeysStore } from '~/stores/apiKeys'

const { t, locale, locales, setLocale } = useI18n()
const router = useRouter()
const apiKeysStore = useApiKeysStore()

// Define head metadata for the settings page
useHead({
  title: 'Settings - Retro AI Assistant',
  meta: [
    { name: 'description', content: 'Configure your Retro AI Assistant settings, API keys, and language preferences.' },
    { name: 'og:title', content: 'Settings - Retro AI Assistant' },
    { name: 'og:description', content: 'Configure your AI assistant settings and preferences' },
    { name: 'og:type', content: 'website' },
    { name: 'og:image', content: '/images/logo.png' },
    { name: 'twitter:card', content: 'summary' },
  ],
})

// API key form data
const apiKeys = reactive({
  geminiApiKey: apiKeysStore.geminiApiKey || '',
  searchApiKey: apiKeysStore.searchApiKey || '',
  searchEngineId: apiKeysStore.searchEngineId || '',
})

// Status message for API keys
const keyStatus = reactive({
  gemini: computed(() => {
    if (!apiKeys.geminiApiKey) return { text: t('settings.api_key_status.using_env'), color: 'text-yellow-400' }
    return { text: t('settings.api_key_status.key_saved'), color: 'text-green-400' }
  }),
  search: computed(() => {
    if (!apiKeys.searchApiKey || !apiKeys.searchEngineId) {
      return { text: t('settings.api_key_status.search_using_env'), color: 'text-yellow-400' }
    }
    return { text: t('settings.api_key_status.search_saved'), color: 'text-green-400' }
  }),
})

// Notification state
const showNotification = ref(false)
const notificationMessage = ref('')

// Set up available locales
const availableLocales = computed(() => {
  return (locales.value || []).map((l) => ({
    code: typeof l === 'object' ? l.code : l,
    name: typeof l === 'object' ? l.name : l,
  }))
})

// Save language setting
const saveLanguage = (localeCode: string) => {
  setLocale(localeCode as 'en' | 'vi')
  notificationMessage.value = t('common.language_changed')
  showNotification.value = true

  // Hide notification after 3 seconds
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// Save API keys
const saveApiKeys = () => {
  apiKeysStore.setGeminiApiKey(apiKeys.geminiApiKey)
  apiKeysStore.setSearchApiKey(apiKeys.searchApiKey)
  apiKeysStore.setSearchEngineId(apiKeys.searchEngineId)

  notificationMessage.value = t('settings.api_keys_saved')
  showNotification.value = true

  // Hide notification after 3 seconds
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// Reset API keys
const resetApiKeys = () => {
  apiKeysStore.resetApiKeys()
  apiKeys.geminiApiKey = ''
  apiKeys.searchApiKey = ''
  apiKeys.searchEngineId = ''
}

// Handle return to chat
const goBackToChat = () => {
  router.push('/chat')
}
</script>

<template>
  <div class="settings-container p-4 max-w-4xl mx-auto">
    <!-- Notification toast -->
    <div
      v-if="showNotification"
      class="notification-toast fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg z-[9999999]"
    >
      {{ notificationMessage }}
    </div>

    <div class="settings-header mb-8 text-center">
      <h1 class="text-3xl mb-2 pixel-font">{{ t('common.settings') }}</h1>
    </div>

    <!-- Language settings card -->
    <div class="settings-card mb-6 p-4 border-4 border-gray-700 bg-gray-800 rounded-lg shadow-md">
      <h2 class="text-xl mb-4 pb-2 border-b-2 border-gray-600 pixel-font">{{ t('settings.interface_language') }}</h2>

      <div class="language-options space-y-3">
        <div v-for="loc in availableLocales" :key="loc.code" class="language-option">
          <button
            @click="saveLanguage(loc.code)"
            class="language-btn pixel-btn w-full py-2 px-4 text-left flex justify-between items-center"
            :class="{ 'active-language': locale === loc.code }"
          >
            <span>{{ loc.name }}</span>
            <span v-if="locale === loc.code" class="checkmark">✓</span>
          </button>
        </div>
      </div>
    </div>

    <!-- API Keys settings card -->
    <div class="settings-card mb-6 p-4 border-4 border-gray-700 bg-gray-800 rounded-lg shadow-md">
      <h2 class="text-xl mb-4 pb-2 border-b-2 border-gray-600 pixel-font">{{ t('settings.api_keys') }}</h2>

      <div class="api-keys-form space-y-4">
        <!-- Gemini API Key -->
        <div class="form-group">
          <label class="block mb-2">{{ t('settings.gemini_api_key') }}</label>
          <input
            v-model="apiKeys.geminiApiKey"
            type="password"
            class="w-full bg-gray-700 border-2 border-gray-600 rounded-md px-3 py-2 text-white"
            :placeholder="t('settings.api_key_placeholder')"
          />
          <div class="mt-1 text-sm text-gray-400">
            <a href="https://ai.google.dev/" target="_blank" class="text-blue-400 hover:underline">
              {{ t('settings.get_gemini_api_key') }} →
            </a>
          </div>
          <!-- API key status -->
          <div class="mt-1" :class="keyStatus.gemini.color">
            {{ keyStatus.gemini.text }}
          </div>
        </div>

        <!-- Search API Key -->
        <div class="form-group">
          <label class="block mb-2">{{ t('settings.search_api_key') }}</label>
          <input
            v-model="apiKeys.searchApiKey"
            type="password"
            class="w-full bg-gray-700 border-2 border-gray-600 rounded-md px-3 py-2 text-white"
            :placeholder="t('settings.api_key_placeholder')"
          />
          <div class="mt-1 text-sm text-gray-400">
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              class="text-blue-400 hover:underline"
            >
              {{ t('settings.get_search_api_key') }} →
            </a>
          </div>
        </div>

        <!-- Search Engine ID -->
        <div class="form-group">
          <label class="block mb-2">{{ t('settings.search_engine_id') }}</label>
          <input
            v-model="apiKeys.searchEngineId"
            type="text"
            class="w-full bg-gray-700 border-2 border-gray-600 rounded-md px-3 py-2 text-white"
            :placeholder="t('settings.search_engine_id_placeholder')"
          />
          <div class="mt-1 text-sm text-gray-400">
            <a
              href="https://programmablesearchengine.google.com/cse/all"
              target="_blank"
              class="text-blue-400 hover:underline"
            >
              {{ t('settings.get_search_engine_id') }} →
            </a>
          </div>
          <!-- Search API status -->
          <div class="mt-1" :class="keyStatus.search.color">
            {{ keyStatus.search.text }}
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex justify-between mt-4">
          <button @click="saveApiKeys" class="pixel-btn px-4 py-2 bg-green-700 hover:bg-green-600">
            {{ t('settings.save_keys') }}
          </button>
          <button @click="resetApiKeys" class="pixel-btn px-4 py-2 bg-red-700 hover:bg-red-600">
            {{ t('settings.reset_keys') }}
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-5">
      <button @click="goBackToChat" class="back-button pixel-btn px-4 py-2 flex items-center">
        <span>←</span>
        <span class="ml-2">{{ t('common.back_to_chat') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  font-family: 'SVN-Retron', monospace;
  color: #eee;
}

.pixel-font {
  font-family: 'SVN-Retron', monospace;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.7);
}

.pixel-btn {
  background-color: #444;
  color: #fff;
  border: 2px solid #666;
  border-radius: 4px;
  image-rendering: pixelated;
  transition: all 0.2s;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
}

.pixel-btn:hover {
  background-color: #555;
  transform: translateY(-2px);
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.5);
}

.pixel-btn:active {
  transform: translateY(0);
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

.active-language {
  background-color: #666;
  border-color: #aaa;
}

.settings-card {
  image-rendering: pixelated;
}

.notification-toast {
  font-family: 'SVN-Retron', monospace;
  animation: fadeInOut 3s ease-in-out;
  border: 2px solid #194d23;
}

.checkmark {
  color: #4ade80;
  font-weight: bold;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  10% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  90% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}

@media (max-width: 640px) {
  .settings-container {
    padding: 1rem;
  }
}
</style>

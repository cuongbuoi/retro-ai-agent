<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()
const router = useRouter()

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
      class="notification-toast fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    >
      {{ notificationMessage }}
    </div>

    <div class="settings-header mb-8 text-center">
      <h1 class="text-3xl mb-2 pixel-font">{{ t('common.settings') }}</h1>
      <div class="flex justify-center">
        <button @click="goBackToChat" class="back-button pixel-btn px-4 py-2 flex items-center">
          <span>←</span>
          <span class="ml-2">{{ t('common.back_to_chat') }}</span>
        </button>
      </div>
    </div>

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

    <!-- Additional settings sections can be added here -->
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

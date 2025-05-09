<template>
  <div class="min-h-screen bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-8 font-['SVN-Retron']">Pixel Buttons</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <PixelButton text="SHARE" color="blue" @click="handleClick('share')" />
          <p class="text-gray-400 text-sm mt-4">Blue button</p>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <PixelButton text="SUBSCRIBE" color="pink" @click="handleClick('subscribe')" />
          <p class="text-gray-400 text-sm mt-4">Pink button</p>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <PixelButton text="LIKE" color="blue" @click="handleClick('like')" />
          <p class="text-gray-400 text-sm mt-4">Blue button</p>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <PixelButton text="COMMENT" color="orange" @click="handleClick('comment')" />
          <p class="text-gray-400 text-sm mt-4">Orange button</p>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <PixelButton text="MESSAGE" color="pink" @click="handleClick('message')" />
          <p class="text-gray-400 text-sm mt-4">Pink button</p>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <PixelButton text="REACTION" color="green" @click="handleClick('reaction')" />
          <p class="text-gray-400 text-sm mt-4">Green button</p>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <PixelButton text="SEND" color="emerald" @click="handleClick('send')" />
          <p class="text-gray-400 text-sm mt-4">Emerald button</p>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <PixelButton text="FAVORITE" color="purple" @click="handleClick('favorite')" />
          <p class="text-gray-400 text-sm mt-4">Purple button</p>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
          <PixelHeartButton @like="handleHeartLike" @unlike="handleHeartUnlike" />
          <p class="text-gray-400 text-sm mt-4">Heart button (toggle)</p>
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-xl font-bold text-white mb-4 font-['SVN-Retron']">Button Actions</h2>
        <div class="bg-gray-800 p-4 rounded-lg">
          <pre class="text-gray-300 font-mono text-sm" id="action-log">Click buttons to see actions here...</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const actionLog = ref<string[]>([])

const handleClick = (action: string) => {
  const timestamp = new Date().toLocaleTimeString()
  actionLog.value.push(`[${timestamp}] Button clicked: ${action.toUpperCase()}`)
  updateActionLog()
}

const handleHeartLike = () => {
  const timestamp = new Date().toLocaleTimeString()
  actionLog.value.push(`[${timestamp}] Heart button: LIKED ❤️`)
  updateActionLog()
}

const handleHeartUnlike = () => {
  const timestamp = new Date().toLocaleTimeString()
  actionLog.value.push(`[${timestamp}] Heart button: UNLIKED 🤍`)
  updateActionLog()
}

const updateActionLog = () => {
  const logElement = document.getElementById('action-log')
  if (logElement) {
    logElement.textContent = actionLog.value.slice(-5).join('\n')
  }
}

onMounted(() => {
  actionLog.value = ['Ready to log button actions...']
  updateActionLog()
})
</script>

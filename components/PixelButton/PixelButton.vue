<template>
  <div class="pixel-button-wrapper" :class="[size]">
    <NuxtLink v-if="routerLink" :to="routerLink" class="nuxt-link">
      <button :class="['pixel-button', colorClass, { disabled: disabled }]" :type="type" :disabled="disabled">
        <div class="button-text">{{ text }}</div>
      </button>
    </NuxtLink>
    <button
      v-else
      :class="['pixel-button', colorClass, { disabled: disabled }]"
      @click="handleClick"
      :type="type"
      :disabled="disabled"
    >
      <div class="button-text">{{ text }}</div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value: string) => ['blue', 'pink', 'green', 'orange', 'purple', 'emerald'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
  },
  size: {
    type: String,
    default: 'default',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  routerLink: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['click'])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

const colorClass = computed(() => {
  return `color-${props.color}`
})
</script>

<style scoped>
.pixel-button-wrapper {
  display: inline-flex;
  transform: scale(1);
  transition: transform 0.1s;
  margin: 0.5rem;
}

.pixel-button-wrapper:hover {
  transform: scale(1.05);
}

.pixel-button-wrapper:active {
  transform: scale(0.98);
}

.pixel-button-wrapper.chat {
  margin: 0;
}

.pixel-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 0;
  font-family: 'SVN-Retron', monospace;
  font-size: 0.9rem;
  line-height: 1;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  cursor: pointer;
  outline: none;
  image-rendering: pixelated;
  min-width: 80px;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

.nuxt-link {
  text-decoration: none;
  display: inline-flex;
}

/* Disabled state styles */
.pixel-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(40%);
}

.pixel-button.disabled:active {
  transform: none;
  box-shadow: inherit;
}

.pixel-button-wrapper:hover .pixel-button.disabled {
  transform: none;
}

.pixel-button-wrapper:active .pixel-button.disabled {
  transform: none;
}

/* Specific button sizes */
.chat .pixel-button {
  height: 38px;
  padding: 0 16px;
}

/* Button colors */
.color-blue {
  background-color: #54aeff;
  box-shadow:
    0 0 0 4px #54aeff,
    0 0 0 6px #1d5a97,
    4px 4px 0 6px #1d5a97;
  border-bottom: 4px solid #2e7cc3;
  border-right: 4px solid #2e7cc3;
}

.color-pink {
  background-color: #ff54c5;
  box-shadow:
    0 0 0 4px #ff54c5,
    0 0 0 6px #97287a,
    4px 4px 0 6px #97287a;
  border-bottom: 4px solid #cb2d94;
  border-right: 4px solid #cb2d94;
}

.color-green {
  background-color: #67cd90;
  box-shadow:
    0 0 0 4px #67cd90,
    0 0 0 6px #26734a,
    4px 4px 0 6px #26734a;
  border-bottom: 4px solid #3d9964;
  border-right: 4px solid #3d9964;
}

.color-emerald {
  background-color: #10b981;
  box-shadow:
    0 0 0 4px #10b981,
    0 0 0 6px #065f43,
    4px 4px 0 6px #065f43;
  border-bottom: 4px solid #059669;
  border-right: 4px solid #059669;
}

.color-orange {
  background-color: #ff9254;
  box-shadow:
    0 0 0 4px #ff9254,
    0 0 0 6px #974a1d,
    4px 4px 0 6px #974a1d;
  border-bottom: 4px solid #c76b2e;
  border-right: 4px solid #c76b2e;
}

.color-purple {
  background-color: #a368ff;
  box-shadow:
    0 0 0 4px #a368ff,
    0 0 0 6px #5a2997,
    4px 4px 0 6px #5a2997;
  border-bottom: 4px solid #7e42cb;
  border-right: 4px solid #7e42cb;
}

.button-text {
  position: relative;
  padding: 0 4px;
  letter-spacing: 1px;
}

/* Active state */
.pixel-button:active {
  transform: translate(2px, 2px);
  box-shadow:
    0 0 0 4px currentColor,
    0 0 0 6px #000;
}
</style>

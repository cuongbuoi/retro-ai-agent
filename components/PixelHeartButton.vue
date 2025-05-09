<template>
  <div class="pixel-heart-wrapper">
    <button class="pixel-heart-button" :class="{ 'is-liked': liked }" @click="toggleLike">
      <div class="pixel-heart">
        <div class="heart-inner"></div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['like', 'unlike'])
const liked = ref(false)

const toggleLike = () => {
  liked.value = !liked.value
  if (liked.value) {
    emit('like')
  } else {
    emit('unlike')
  }
}
</script>

<style scoped>
.pixel-heart-wrapper {
  display: inline-block;
  margin: 0.5rem;
  transform: scale(1);
  transition: transform 0.1s;
}

.pixel-heart-wrapper:hover {
  transform: scale(1.05);
}

.pixel-heart-wrapper:active {
  transform: scale(0.95);
}

.pixel-heart-button {
  position: relative;
  display: block;
  width: 64px;
  height: 64px;
  background-color: rgb(34, 197, 94);
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  box-shadow: 0px 6px 0px rgba(0, 0, 0, 0.3);
  transition: all 0.1s;
}

.pixel-heart-button::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.2);
  clip-path: polygon(
    0 0,
    10px 0,
    10px 2px,
    calc(100% - 10px) 2px,
    calc(100% - 10px) 0,
    100% 0,
    100% 10px,
    calc(100% - 2px) 10px,
    calc(100% - 2px) calc(100% - 10px),
    100% calc(100% - 10px),
    100% 100%,
    calc(100% - 10px) 100%,
    calc(100% - 10px) calc(100% - 2px),
    10px calc(100% - 2px),
    10px 100%,
    0 100%,
    0 calc(100% - 10px),
    2px calc(100% - 10px),
    2px 10px,
    0 10px
  );
  z-index: 2;
}

.pixel-heart-button::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
  clip-path: polygon(
    calc(100% - 10px) 0,
    100% 0,
    100% 100%,
    0 100%,
    0 calc(100% - 10px),
    calc(100% - 10px) calc(100% - 10px)
  );
  z-index: 1;
}

.pixel-heart {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.heart-inner {
  width: 32px;
  height: 32px;
  background-color: #ffffff;
  clip-path: polygon(
    50% 0%,
    61.8% 18.6%,
    100% 18.6%,
    75% 43.2%,
    82% 82%,
    50% 64%,
    18% 82%,
    25% 43.2%,
    0% 18.6%,
    38.2% 18.6%
  );
  transition: background-color 0.3s;
}

.is-liked .heart-inner {
  background-color: #ff3366;
}
</style>

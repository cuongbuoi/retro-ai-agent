<template>
  <div class="loading-container">
    <div class="pixel-dot"></div>
    <div class="pixel-dot"></div>
    <div class="pixel-dot"></div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 20px;
  margin: 10px 0;
}

.pixel-dot {
  width: 8px;
  height: 8px;
  background-color: #ec4899; /* pink-500 */
  border: 2px solid #9d174d; /* pink-900 */
  box-shadow: 2px 2px 0 rgba(236, 72, 153, 0.3);
  animation: blink 1s infinite;
  image-rendering: pixelated;
}

.pixel-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.pixel-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

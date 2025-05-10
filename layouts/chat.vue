<template>
  <div class="chat-layout">
    <div class="pixel-bg"></div>
    <div class="layout-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.chat-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #fdf2f8;
}

.pixel-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(219, 39, 119, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(219, 39, 119, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
  pointer-events: none;
}

.layout-content {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
}
</style>

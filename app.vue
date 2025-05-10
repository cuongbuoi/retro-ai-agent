<template>
  <div class="pixel-app">
    <div class="pixel-bg"></div>
    <NuxtPage />
  </div>
</template>

<style>
@font-face {
  font-family: 'SVN-Retron';
  src: url('/assets/fonts/SVN-Retron 2000/SVN-Retron 2000.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'SVN-Retron', monospace;
}

.pixel-app {
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: #fdf2f8;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

/* Pixel art button styles for the entire app */
button {
  font-family: 'SVN-Retron', monospace;
  text-transform: uppercase;
  cursor: pointer;
}

.pixel-box {
  background-color: #fbcfe8;
  border: 4px solid #f9a8d4;
  border-radius: 4px;
  box-shadow: 0 6px 0 #f472b6;
  padding: 16px;
  margin: 12px;
  position: relative;
}

.pixel-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  clip-path: polygon(
    0 0,
    100% 0,
    100% 10px,
    calc(100% - 10px) 10px,
    calc(100% - 10px) calc(100% - 10px),
    10px calc(100% - 10px),
    10px 10px,
    0 10px
  );
}

.pixel-title {
  color: white;
  text-shadow: 2px 2px 0 #db2777;
  letter-spacing: 1px;
  margin-bottom: 16px;
}
</style>

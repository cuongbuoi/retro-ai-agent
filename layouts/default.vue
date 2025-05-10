<template>
  <div class="default-layout">
    <div class="pixel-bg"></div>
    <AppNavigation />
    <div class="container mx-auto px-4 py-8">
      <header class="mb-8">
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl text-pink-600 font-bold pixel-title mb-2">
            {{ $t('header.title') }}
          </h1>
          <p class="text-gray-600">
            {{ $t('header.description') }}
          </p>
        </div>
      </header>

      <main class="content-wrapper">
        <slot />
      </main>

      <footer class="mt-12 text-center text-sm text-gray-500">
        <p>© {{ new Date().getFullYear() }} {{ $t('footer.copyright') }}</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.default-layout {
  min-height: calc(100vh - 67px);
  width: 100%;
  position: relative;
  background-color: #fdf2f8;
  padding-bottom: 20px;
  margin-top: 67px;
  overflow-y: auto;
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

.content-wrapper {
  position: relative;
  z-index: 1;
}

.pixel-title {
  text-shadow: 3px 3px 0 #f472b6;
  letter-spacing: 1px;
}
</style>

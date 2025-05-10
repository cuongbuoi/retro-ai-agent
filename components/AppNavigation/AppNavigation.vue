<script setup lang="ts">
import { PATHS } from '~/constants/routes'

const { t, locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()

const changeLanguage = (code: string) => {
  setLocale(code)
}

const currentLocale = computed(() => {
  return locales.value.find((l) => l.code === locale.value)?.name
})
</script>

<template>
  <nav class="app-navigation">
    <div class="nav-container">
      <NuxtLink :to="localePath({ name: PATHS.CHAT.name })" class="nav-link">
        <span class="nav-icon">💬</span>
        <span class="nav-text">Chat</span>
      </NuxtLink>

      <div class="dropdown dropdown-end language-dropdown">
        <div tabindex="0" role="button" class="lang-btn">
          <span class="nav-icon">🌐</span>
          <span class="nav-text">{{ currentLocale }}</span>
        </div>
        <div tabindex="0" class="dropdown-content">
          <div class="lang-menu">
            <div
              v-for="lang in locales"
              :key="lang.code"
              class="lang-item"
              :class="{ active: locale === lang.code }"
              @click="changeLanguage(lang.code)"
            >
              {{ lang.name }}
            </div>
          </div>
        </div>
      </div>

      <NuxtLink :to="localePath({ name: PATHS.SETTINGS.name })" class="nav-link">
        <span class="nav-icon">⚙️</span>
        <span class="nav-text">{{ t('common.settings') }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.app-navigation {
  width: 100%;
  background-color: #222;
  border-bottom: 4px solid #444;
  padding: 8px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  padding: 0 16px;
  gap: 16px;
}

.nav-link,
.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  color: #eee;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
  background: none;
  border: none;
  font-size: inherit;
  cursor: pointer;
}

.language-dropdown {
  position: relative;
}

.lang-btn {
  border: 3px solid #f9a8d4;
  box-shadow: 0 3px 0 #db2777;
  background-color: #f472b6;
  color: white;
  image-rendering: pixelated;
  position: relative;
  border-radius: 2px;
}

.lang-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 0 #db2777;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 150px;
  z-index: 20;
}

.language-dropdown:focus-within .dropdown-content {
  display: block;
}

.lang-menu {
  background-color: #fbcfe8;
  border: 4px solid #f9a8d4;
  border-radius: 4px;
  box-shadow: 0 6px 0 #f472b6;
  padding: 8px;
  position: relative;
}

.lang-menu::before {
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
  pointer-events: none;
}

.lang-item {
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 2px;
  transition: all 0.2s ease;
  color: #db2777;
  font-family: 'SVN-Retron', monospace;
  text-transform: uppercase;
  font-size: 0.9em;
  cursor: pointer;
  text-align: center;
}

.lang-item:hover {
  background-color: #f472b6;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 0 #db2777;
}

.lang-item.active {
  background-color: #db2777;
  color: white;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.nav-link.router-link-active {
  background-color: #555;
  border-bottom: 2px solid #db2777;
}

.nav-icon {
  font-size: 1.2em;
}

.nav-text {
  font-family: 'SVN-Retron', monospace;
  font-size: 0.9em;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .nav-text {
    display: none;
  }

  .nav-container {
    justify-content: center;
  }

  .nav-link,
  .lang-btn {
    padding: 8px;
  }

  .nav-icon {
    font-size: 1.5em;
  }

  .dropdown-content {
    position: fixed;
    top: 50px;
    right: 16px;
  }
}
</style>

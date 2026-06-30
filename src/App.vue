<template>
  <div :style="themeVariables" class="app-container" :class="{ 'app-dark': isDarkMode }">
    <Transition name="fade">
      <div v-if="isLoading" class="splash-overlay d-flex flex-column align-items-center justify-content-center" :class="{ 'dark-mode': isDarkMode }">
        <div class="text-center">
          <LayeredLoader class="splash-logo mb-5" />
          <h2 class="hero-brand brand-text m-0 splash-text">
            <span class="hero-logo-cook">Cook</span><span class="hero-logo-it">IT</span><span class="hero-logo-alia">alia</span>
          </h2>
        </div>
      </div>
    </Transition>

    <div class="app-content" :class="{ 'blur-content': isLoading }">
      <NavBar :is-dark-mode="isDarkMode" @toggle-theme="toggleTheme" />
      <main class="app-main">
        <router-view :is-dark-mode="isDarkMode" @toggle-theme="toggleTheme" />
      </main>
      <footer class="app-footer">
        <span>© 2026 CookITalia. Tutti i diritti riservati.</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import LayeredLoader from './components/LayeredLoader.vue'

const isLoading = ref(true)
const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

const themeVariables = computed(() => {
  if (!isDarkMode.value) {
    return {
      '--color-primary-theme': 'var(--color-green)',
      '--color-primary-theme-hover': 'var(--color-green-hover)',
      '--color-recipe-banner-gradient-start': 'var(--color-green)',
      '--color-recipe-banner-gradient-end': 'var(--color-green-soft)',
      '--color-background': '#ffffff',
      '--color-navbar': '#f8f8f8',
      '--color-card-bg': '#f8f8f8',
      '--color-btn-bg': 'var(--color-white-logo)',
      '--color-text-primary': '#202124',
      '--color-text-secondary': '#5f6368',
      '--color-text-muted': '#5f6368',
      '--color-text-inverse': '#ffffff',
      '--color-disabled-bg': '#d0d4da',
      '--color-disabled-input-bg': 'color-mix(in srgb, var(--color-navbar) 93%, #000000)',
      '--color-border': '#f7f7f6',
      '--color-nav-hover': 'var(--color-primary-theme)',
      '--favorite-accent': 'var(--color-primary-theme)',
      '--color-search-bg': '#ffffff',
      '--color-search-border': 'var(--color-border)',
      '--color-search-border-active': '#cccccc',
      '--color-search-divider': '#eeeeee',
      '--color-search-icon': '#757575',
      '--color-search-placeholder': '#888888',
      '--color-search-text': '#000000',
      '--color-search-hover-bg': '#f1f3f4',
      '--color-search-hover-text': '#000000',
      '--color-overlay-bg': 'rgba(0, 0, 0, 0.6)',
      '--color-photo-overlay-bg': 'rgba(0, 0, 0, 0.42)',
      '--color-focus-ring': 'color-mix(in srgb, var(--color-primary-theme) 25%, transparent)',
      '--color-input-bg': '#ffffff',
      '--color-input-border': 'var(--color-border)',
      '--color-input-placeholder': '#888888',
      '--color-navbar-divider': '#000000'
    }
  }

  return {
    '--color-primary-theme': 'var(--color-red)',
    '--color-primary-theme-hover': 'var(--color-red-hover)',
    '--color-recipe-banner-gradient-start': 'var(--color-red)',
    '--color-recipe-banner-gradient-end': 'var(--color-red-soft)',
    '--color-background': '#121212',
    '--color-navbar': '#000000',
    '--color-card-bg': '#121212',
    '--color-btn-bg': '#242424',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#ffffff',
    '--color-text-muted': '#ffffff',
    '--color-text-inverse': '#ffffff',
    '--color-disabled-bg': '#d0d4da',
    '--color-disabled-input-bg': 'color-mix(in srgb, var(--color-navbar) 93%, #ffffff)',
    '--color-border': '#3c4043',
    '--color-nav-hover': 'var(--color-primary-theme)',
    '--favorite-accent': 'var(--color-primary-theme)',
    '--color-search-bg': '#303134',
    '--color-search-border': '#5f6368',
    '--color-search-border-active': '#5f6368',
    '--color-search-divider': '#3c4043',
    '--color-search-icon': '#9aa0a6',
    '--color-search-placeholder': '#9aa0a6',
    '--color-search-text': '#e8eaed',
    '--color-search-hover-bg': '#3c4043',
    '--color-search-hover-text': '#ffffff',
    '--color-overlay-bg': 'rgba(0, 0, 0, 0.6)',
    '--color-photo-overlay-bg': 'rgba(0, 0, 0, 0.42)',
    '--color-focus-ring': 'color-mix(in srgb, var(--color-primary-theme) 25%, transparent)',
    '--color-input-bg': '#000000',
    '--color-input-border': 'var(--color-border)',
    '--color-input-placeholder': '#ffffff',
    '--color-navbar-divider': 'var(--color-border)'
  }
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 2200)
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1 0 auto;
}

.app-footer {
  flex-shrink: 0;
  padding: 1rem 1.5rem;
  text-align: center;
  background-color: var(--color-navbar);
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;
}

.blur-content {
  filter: blur(2px);
  pointer-events: none;
  transition: filter 0.6s ease-out;
}

.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-leave-to {
  opacity: 0;
}
</style>

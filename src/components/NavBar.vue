<template>
  <nav class="navbar navbar-expand-lg sticky-top app-navbar shadow-sm" :class="[isDarkMode ? 'navbar-dark' : 'navbar-light', isAtTopAndHome ? 'navbar-large' : '']">
    <div class="container-fluid container-custom-fluid">
      
      <router-link to="/" class="navbar-brand d-flex align-items-center logo-expand-center">
        <img :src="isDarkMode ? logoDark : logoLight" alt="CookITalia" class="brand-logo">
        <span class="hero-brand brand-text">
          <span class="hero-logo-cook">Cook</span><span class="hero-logo-it">IT</span><span class="hero-logo-alia">alia</span>
        </span>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-between" id="navbarContent">
        
        <div ref="searchWrapper" class="d-flex position-relative search-form google-search-wrapper" @focusin="showDropdown = true">
          
          <div class="google-search-container" :class="{ 'has-dropdown': showDropdown, 'google-dark-mode': isDarkMode }">
            
            <div class="google-search-box">
              <span class="google-search-icon">
                <i class="bi bi-search"></i>
              </span>
              <input 
                ref="searchInput"
                type="text" 
                class="google-input" 
                placeholder="Search recipes..." 
                v-model="searchQuery"
                @keydown="handleSearchKeydown"
                aria-label="Search recipes"
                autocomplete="off"
              />
              <button 
                v-if="searchQuery" 
                type="button" 
                class="clear-search-btn" 
                @click="clearSearch"
                title="Clear search"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div v-if="showDropdown" class="google-dropdown-panel">
              
              <div v-if="searchQuery">
                <div 
                  v-for="(recipe, index) in filteredRecipes" 
                  :key="'filtered-' + index" 
                  class="dropdown-item-google"
                  @click="triggerSearch(recipe.title)"
                >
                  <i class="bi bi-search me-3 text-muted"></i>
                  <span>{{ recipe.title }}</span>
                </div>
                <div v-if="filteredRecipes.length === 0" class="dropdown-item-google text-muted">
                  <span>No recipes found for "{{ searchQuery }}"</span>
                </div>
              </div>

              <div v-else>
                <div class="dropdown-header-title px-3 py-1 text-muted small fw-bold">RECENT SEARCHES</div>
                <div 
                  v-for="(search, index) in searchHistory" 
                  :key="'history-' + index" 
                  class="dropdown-item-google"
                  @click="triggerSearch(search)"
                >
                  <i class="bi bi-clock-history me-3 text-muted"></i>
                  <span>{{ search }}</span>
                </div>
                <div v-if="searchHistory.length === 0" class="dropdown-item-google text-muted">
                  <span>No recent searches</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <ul class="navbar-nav align-items-center gap-container">
          <li class="nav-item">
            <a href="/" class="nav-link" @click.prevent="goHome">Home</a>
          </li>
          <li class="nav-item">
            <a href="#esplora" class="nav-link" @click.prevent="goToExplore">Explore</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="piattiDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Dishes
            </a>
            <ul class="dropdown-menu" aria-labelledby="piattiDropdown">
              <li><router-link class="dropdown-item" :to="{ name: 'dish-category', params: { category: 'primi' } }">First Courses</router-link></li>
              <li><router-link class="dropdown-item" :to="{ name: 'dish-category', params: { category: 'secondi' } }">Main Courses</router-link></li>
              <li><router-link class="dropdown-item" :to="{ name: 'dish-category', params: { category: 'contorni' } }">Side Dishes</router-link></li>
              <li><router-link class="dropdown-item" :to="{ name: 'dish-category', params: { category: 'dolci' } }">Desserts</router-link></li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link to="/favorites" class="nav-link"><i class="bi bi-heart"></i> Favorites</router-link>
          </li>
          
          <li class="nav-item custom-divider ps-4 ms-2">
            <button class="btn-theme-link nav-link px-0" @click="$emit('toggle-theme')" title="Change theme">
              <i class="theme-icon bi" :class="isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'"></i>
            </button>
          </li>

          <li class="nav-item">
            <div v-if="isLoggedIn" class="dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" @click.prevent="toggleUserDropdown" :class="{ show: showUserDropdown }">
                <img
                  v-if="navProfilePhoto"
                  :src="navProfilePhoto"
                  alt="Profile"
                  class="nav-profile-photo"
                  aria-label="Profile"
                />
                <i v-else class="bi bi-person-circle profile-icon" aria-label="Profile"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" :class="{ show: showUserDropdown }" aria-labelledby="userDropdown" style="position: absolute; right: 0;">
                <li><router-link class="dropdown-item" to="/settings" @click="closeDropdowns">Settings</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click.prevent="handleLogout(); closeDropdowns()">Logout</a></li>
              </ul>
            </div>
            <a v-else href="#" class="nav-link nav-link-auth-custom" @click.prevent="showAuthModal = true">
              Login / Register
            </a>
          </li>
        </ul>
      </div>
    </div>

    <AuthModal v-if="showAuthModal" :is-dark-mode="isDarkMode" @close="showAuthModal = false" />
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from '../firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import AuthModal from './AuthModal.vue'
import { getUserProfile, saveSearchToHistory, getSearchHistory, getAllRecipes } from '../services/api' 

// Import corretto dei file dei logo per risolvere il problema visivo
import logoDark from '../assets/logo.png'
import logoLight from '../assets/logo light mode.png'

defineProps({ isDarkMode: Boolean })
defineEmits(['toggle-theme'])

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)
const navProfilePhoto = ref(null)

const searchQuery = ref('')
const showDropdown = ref(false)
const scrollY = ref(0)
const showAuthModal = ref(false)
const showUserDropdown = ref(false)

const searchHistory = ref([])
const allRecipes = ref([]) 
const searchWrapper = ref(null) 
const searchInput = ref(null) // Riferimento per l'elemento input
let searchSuggestionsTimeout = null

const handleScroll = () => { scrollY.value = window.scrollY }
const isAtTopAndHome = computed(() => route.name === 'home' && scrollY.value === 0)

const closeDropdowns = (event) => {
  showUserDropdown.value = false
  if (searchWrapper.value && !searchWrapper.value.contains(event.target)) {
    showDropdown.value = false
  }
}

const toggleUserDropdown = (event) => {
  event.stopPropagation()
  showUserDropdown.value = !showUserDropdown.value
}

// Svuota il testo di ricerca e rimette il focus dentro la barra
const clearSearch = () => {
  searchQuery.value = ''
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  })
}

const filteredRecipes = computed(() => {
  if (!searchQuery.value) return []
  return allRecipes.value.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).slice(0, 5) 
})

const getTopRecipeSuggestion = () => filteredRecipes.value[0] || null

const loadSearchData = async (uid) => {
  try {
    if (uid) {
      searchHistory.value = await getSearchHistory(uid)
    }
    allRecipes.value = await getAllRecipes('Italian', 8)
  } catch (e) {
    console.error("Errore nel caricamento dei dati di ricerca", e)
  }
}

watch(searchQuery, (query) => {
  const cleanedQuery = query.trim()
  if (searchSuggestionsTimeout) clearTimeout(searchSuggestionsTimeout)
  if (cleanedQuery.length < 2) {
    allRecipes.value = []
    return
  }

  searchSuggestionsTimeout = setTimeout(async () => {
    try {
      allRecipes.value = await getAllRecipes(cleanedQuery, 6)
    } catch (e) {
      console.error("Errore nel caricamento dei suggerimenti API", e)
      allRecipes.value = []
    }
  }, 250)
})

const triggerSearch = async (queryParam = null) => {
  let finalQuery = queryParam ? queryParam.trim() : searchQuery.value.trim()

  if (!finalQuery) return
  
  if (auth.currentUser) {
    await saveSearchToHistory(auth.currentUser.uid, finalQuery)
    searchHistory.value = await getSearchHistory(auth.currentUser.uid)
  }
  
  searchQuery.value = ''
  showDropdown.value = false
  router.push({ name: 'search', query: { q: finalQuery } })
}

const openRecipe = async (recipe) => {
  if (!recipe?.id) return

  const title = recipe.title?.trim()
  if (auth.currentUser && title) {
    await saveSearchToHistory(auth.currentUser.uid, title)
    searchHistory.value = await getSearchHistory(auth.currentUser.uid)
  }

  searchQuery.value = ''
  showDropdown.value = false
  router.push({ name: 'recipe-detail', params: { id: recipe.id } })
}

const handleSearchKeydown = (event) => {
  const topRecipe = getTopRecipeSuggestion()

  if (event.key === 'Tab' && topRecipe?.title) {
    event.preventDefault()
    searchQuery.value = topRecipe.title
    showDropdown.value = true
    nextTick(() => {
      if (searchInput.value) {
        const endPosition = searchQuery.value.length
        searchInput.value.setSelectionRange(endPosition, endPosition)
      }
    })
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    if (topRecipe) {
      openRecipe(topRecipe)
    } else {
      triggerSearch()
    }
  }
}

const refreshNavPhoto = async (uid) => {
  if (!uid) { navProfilePhoto.value = null; return }
  try {
    const profile = await getUserProfile(uid)
    navProfilePhoto.value = profile?.photoBase64 || null
  } catch (e) {
    navProfilePhoto.value = null
  }
}

const handleProfileUpdated = () => {
  if (auth.currentUser) refreshNavPhoto(auth.currentUser.uid)
}

const handleHistoryCleared = () => {
  searchHistory.value = []
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', closeDropdowns) 
  window.addEventListener('profile-updated', handleProfileUpdated)
  window.addEventListener('search-history-cleared', handleHistoryCleared)
  handleScroll()
  
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user
    refreshNavPhoto(user?.uid || null)
    loadSearchData(user?.uid || null)
  })
})

onUnmounted(() => { 
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', closeDropdowns) 
  window.removeEventListener('profile-updated', handleProfileUpdated)
  window.removeEventListener('search-history-cleared', handleHistoryCleared)
  if (searchSuggestionsTimeout) clearTimeout(searchSuggestionsTimeout)
})

const goHome = async () => {
  if (route.name !== 'home') {
    await router.push({ name: 'home' })
    await nextTick()
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToExplore = async () => {
  if (route.name !== 'home') {
    await router.push({ name: 'home' })
    await nextTick()
  }

  setTimeout(() => {
    const section = document.getElementById('esplora') || document.getElementById('recommended')
    
    if (section) {
      const navbarOffset = 90; 
      const elementPosition = section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    } else {
      document.getElementById('esplora')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 150) 
}

const handleLogout = async () => {
  try { 
    await signOut(auth)
    searchHistory.value = []
    router.push('/')
  } catch (error) { 
    console.error("Errore durante il logout", error)
  }
}
</script>

<style scoped>
/* ==========================================================================
   1. STRUTTURA ED ALTEZZE DELLA NAVBAR
   ========================================================================== */
.app-navbar {
  transition: padding 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--color-navbar);
  border-bottom: 1px solid var(--color-border);
  will-change: padding, background-color;
}

.container-custom-fluid {
  padding-left: 40px;  
  padding-right: 40px; 
  display: flex;
  align-items: center;
  gap: 2rem; 
}

.gap-container {
  gap: 1rem;
  transition: gap 0.3s ease;
}

.navbar-large {
  padding-top: 1.5rem;    
  padding-bottom: 1.5rem; 
}
.navbar-large .container-custom-fluid {
  padding-left: 50px;  
  padding-right: 40px; 
  gap: 2rem; 
}

.logo-expand-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px; 
  transition: padding 0.35s cubic-bezier(0.4, 0, 0.2, 1), gap 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: gap;
}
.navbar-large .logo-expand-center { padding: 0 20px; gap: 15px; }
.brand-logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: width, height;
}
.navbar-large .brand-logo { width: 130px; height: 130px; }

.app-navbar .navbar-nav .nav-link { 
  font-size: 1rem; 
  font-weight: 500; 
  color: var(--color-text-primary);
}
.profile-icon { font-size: 1.5rem; }

.nav-profile-photo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-navbar .dropdown-item, .app-navbar .dropdown-header { 
  font-size: 0.95rem; 
  color: var(--color-text-primary);
}

.btn-theme-link {
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  padding: 0;
}

/* ==========================================================================
   2. BARRA DI RICERCA SITO (GESTIONE LIGHT & DARK REALISTICA)
   ========================================================================== */
.search-form { 
  width: 460px;       
  position: relative; 
  height: 45px;       
  flex-shrink: 0;
  transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: height;
}
.navbar-large .search-form { height: 55px; }

.google-search-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--color-search-bg);
  border: 1px solid var(--color-search-border);
  border-radius: 24px;
  overflow: hidden; 
}

.google-search-container.google-dark-mode {
  background-color: var(--color-search-bg);
  border-color: var(--color-search-border);
}

.google-search-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 45px; 
  padding: 0 16px;
}
.navbar-large .google-search-box { height: 55px; }

.google-search-container.has-dropdown {
  box-shadow: 0 4px 12px rgba(32,33,36,0.15); 
  border-color: var(--color-search-border-active);
}
.google-search-container.has-dropdown .google-search-box {
  border-bottom: 1px solid var(--color-search-divider);
}

.google-search-container.google-dark-mode.has-dropdown {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border-color: var(--color-search-border-active);
}
.google-search-container.google-dark-mode.has-dropdown .google-search-box {
  border-bottom: 1px solid var(--color-search-divider);
}

.google-search-icon {
  display: flex;
  align-items: center;
  color: var(--color-search-icon);
  padding-right: 12px;
  font-size: 1.2rem;
}
.google-dark-mode .google-search-icon {
  color: var(--color-search-icon);
}

.google-input {
  border: none; 
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  background: transparent; 
  box-shadow: none;
  font-size: 1.1rem;
  color: var(--color-search-text);
  outline: none;
}
.google-dark-mode .google-input,
.google-dark-mode .google-input:focus {
  background-color: transparent;
  color: var(--color-search-text);
}

.google-input::placeholder { color: var(--color-search-placeholder); }
.google-dark-mode .google-input::placeholder { color: var(--color-search-placeholder); }

/* Pulsante Cancella "X" nella barra */
.clear-search-btn {
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-search-icon);
  padding: 0 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}
.clear-search-btn:hover {
  color: var(--color-search-hover-text);
}
.google-dark-mode .clear-search-btn {
  color: var(--color-search-icon);
}
.google-dark-mode .clear-search-btn:hover {
  color: var(--color-search-hover-text);
}

/* ==========================================================================
   3. PANNELLO DROP DOWN BARRA DI RICERCA & HOVER CON COLORI DELLO SFONDO UGUALI
   ========================================================================== */
.google-dropdown-panel {
  padding: 8px 0;
  background-color: var(--color-search-bg);
  transition: background-color 0.3s ease;
}
.google-dark-mode .google-dropdown-panel {
  background-color: var(--color-search-bg);
}

.dropdown-header-title {
  letter-spacing: 0.5px;
  font-size: 0.8rem;
}

.dropdown-item-google {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  font-size: 1rem;
  color: var(--color-search-text);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.google-dark-mode .dropdown-item-google {
  color: var(--color-search-text);
}

.dropdown-item-google:hover {
  background-color: var(--color-search-hover-bg);
  color: var(--color-search-hover-text);
}

.google-dark-mode .dropdown-item-google:hover {
  background-color: var(--color-search-hover-bg);
  color: var(--color-search-hover-text);
}

/* ==========================================================================
   4. REGOLE LINK GENERALE ED EFFETTI HOVER MENU TENDINA DISHES (TESTO CAMBIA COLORE)
   ========================================================================== */
.app-navbar .navbar-nav .nav-link:hover, 
.app-navbar .navbar-nav .nav-link:focus, 
.app-navbar .navbar-nav .nav-link.active,
.app-navbar .nav-link-auth-custom:hover { 
  color: var(--color-nav-hover); 
}

.app-navbar .navbar-nav .nav-link:active {
  background-color: transparent;
  color: var(--color-nav-hover);
}

.app-navbar .dropdown-item {
  transition: background-color 0.2s ease, color 0.2s ease;
}

.navbar-light .dropdown-item:hover,
.navbar-light .dropdown-item:focus {
  background-color: var(--color-search-hover-bg);
  color: var(--color-primary-theme);
}

.navbar-dark .dropdown-item:hover,
.navbar-dark .dropdown-item:focus {
  background-color: var(--color-search-hover-bg);
  color: var(--color-primary-theme);
}

.app-navbar .dropdown-item:active {
  background-color: transparent;
  color: var(--color-nav-hover);
}

.custom-divider { border-left: 1px solid var(--color-border); }
.navbar-toggler { border-color: var(--color-border); }
.dropdown-menu { background-color: var(--color-navbar); border-color: var(--color-border); }
.dropdown-divider { border-color: var(--color-border); }
.theme-icon { color: var(--color-primary-theme); }
</style>

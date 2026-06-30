<template>
  <div class="search-results-view pb-5 min-vh-100 pt-5 mt-5">
    <div class="container">
      <div class="mb-5 border-bottom pb-4">
        <h2 class="fw-bold mb-2">Results for: <span class="text-primary-custom">"{{ route.query.q }}"</span></h2>
        <p class="text-muted">Explore the recipes found for your search.</p>
      </div>

      <div v-if="loading" class="block-loader">
        <LayeredLoader class="loader-logo" />
        <h4 class="fw-bold text-uppercase loader-text">
          <span class="hero-logo-cook">Cook</span><span class="hero-logo-it">IT</span><span class="hero-logo-alia">alia</span>
        </h4>
      </div>

      <div v-else-if="recipes.length > 0" class="row g-4">
        <div class="col-12 col-md-6 col-lg-4" v-for="recipe in recipes" :key="recipe.id">
          <div class="card h-100 slide-card rounded-4 overflow-hidden position-relative border-0 shadow-sm">
            <button class="btn result-icon-button rounded-circle position-absolute top-0 end-0 m-3 shadow-sm z-1"
                    :class="{ 'is-favorite': favorites.includes(Number(recipe.id)) }"
                    @click="toggleFavorite(recipe)"
                    style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
              <i class="favorite-heart bi" :class="favorites.includes(Number(recipe.id)) ? 'bi-heart-fill' : 'bi-heart'"></i>
            </button>
            
            <img :src="recipe.image" class="card-img-top object-fit-cover" :alt="recipe.title" style="height: 220px;" @error="handleImageError">
            <div class="card-body p-4 d-flex flex-column">
              <span v-if="recipe.recipeTypeLabel" class="badge recipe-type-badge align-self-start mb-3">
                {{ recipe.recipeTypeLabel }}
              </span>
              <h5 class="card-title fw-bold mb-2">{{ recipe.title }}</h5>
              <p class="card-text text-muted small mb-3 line-clamp-2" v-html="recipe.summary || 'No description available.'"></p>
              <div class="d-flex justify-content-between align-items-center mt-auto">
                <span class="badge result-time-badge border"><i class="bi bi-clock me-1"></i> {{ recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : 'N/A' }}</span>
                <router-link :to="'/recipe/' + recipe.id" class="text-primary-custom fw-bold text-decoration-none small recipe-link">View recipe <i class="bi bi-arrow-right"></i></router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-search text-muted mb-3 d-block" style="font-size: 3rem;"></i>
        <h4 class="text-muted">No recipes found for this search.</h4>
        <p class="text-muted">Try using different terms or search another category.</p>
        <router-link to="/" class="btn btn-primary-custom mt-3 rounded-pill px-4">Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import LayeredLoader from './LayeredLoader.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ensureUserProfile, getFavoriteIds, toggleFavoriteRecipe } from '../services/api'

defineProps({
  isDarkMode: Boolean
})

const route = useRoute()
const recipes = ref([])
const loading = ref(true)
const favorites = ref([])
const currentUser = ref(null)

const handleImageError = (e) => { e.target.style.display = 'none' }

const toggleFavorite = async (recipe) => {
  if (!currentUser.value) {
    alert("Please login or register first to save your favorites!")
    return
  }

  try {
    favorites.value = await toggleFavoriteRecipe(currentUser.value.uid, recipe, favorites.value)
  } catch (err) {
    console.error("Errore nell'aggiornamento dei preferiti", err)
  }
}

const fetchResults = async (query) => {
  loading.value = true; recipes.value = []
  if (query) { recipes.value = await api.searchRecipes(query, 24) }
  loading.value = false
}

onMounted(() => {
  fetchResults(route.query.q)
  
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (user) {
      try {
        await ensureUserProfile(user)
        favorites.value = await getFavoriteIds(user.uid)
        await fetchResults(route.query.q)
      } catch (err) {
        console.error("Errore nel caricamento dei preferiti", err)
      }
    } else {
      favorites.value = []
    }
  })
})

watch(() => route.query.q, (newQuery) => { fetchResults(newQuery) })
</script>

<style scoped>
.search-results-view { background-color: var(--color-background); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.slide-card { transition: transform 0.3s ease, box-shadow 0.3s ease; background-color: var(--color-navbar); }
.slide-card:hover { transform: translateY(-5px); }
.result-time-badge { background-color: var(--color-background); color: var(--color-text-secondary); border-color: var(--color-border); }
.recipe-link { color: var(--color-primary-theme); }
</style>

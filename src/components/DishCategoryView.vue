<template>
  <main class="dish-category-view min-vh-100 py-5">
    <div class="container">
      <div class="category-header border-bottom pb-4 mb-5">
        <router-link to="/" class="back-link text-decoration-none fw-semibold small d-inline-flex align-items-center gap-2 mb-3">
          <i class="bi bi-arrow-left"></i>
          Home
        </router-link>
        <p class="text-muted text-uppercase fw-semibold small mb-2">Dishes</p>
        <h1 class="fw-bold mb-2">{{ categoryTitle }}</h1>
        <p class="text-muted mb-0">{{ categoryDescription }}</p>
      </div>

      <div v-if="loading" class="block-loader">
        <LayeredLoader class="loader-logo" />
        <h4 class="fw-bold text-uppercase loader-text">
          <span class="hero-logo-cook">Cook</span><span class="hero-logo-it">IT</span><span class="hero-logo-alia">alia</span>
        </h4>
      </div>

      <div v-else-if="recipes.length > 0" class="row g-4">
        <div class="col-12 col-md-6 col-lg-4" v-for="recipe in recipes" :key="recipe.id">
          <article class="card h-100 slide-card rounded-4 overflow-hidden position-relative border-0 shadow-sm">
            <button
              class="btn category-icon-button rounded-circle position-absolute top-0 end-0 m-3 shadow-sm z-1"
              :class="{ 'is-favorite': favorites.includes(Number(recipe.id)) }"
              @click="toggleFavorite(recipe)"
              aria-label="Add to favorites"
            >
              <i class="favorite-heart bi" :class="favorites.includes(Number(recipe.id)) ? 'bi-heart-fill' : 'bi-heart'"></i>
            </button>

            <div class="card-image-wrap">
              <img :src="recipe.image" class="card-img-top category-image" :alt="recipe.title" @error="handleImageError">
            </div>

            <div class="card-body p-4 d-flex flex-column">
              <span v-if="recipe.recipeTypeLabel" class="badge recipe-type-badge align-self-start mb-3">
                {{ recipe.recipeTypeLabel }}
              </span>
              <h2 class="card-title fw-bold mb-2 h5">{{ recipe.title }}</h2>
              <p class="card-text text-muted small mb-3 line-clamp-2" v-html="recipe.summary || 'No description available.'"></p>
              <div class="d-flex justify-content-between align-items-center gap-3 mt-auto">
                <span class="badge category-time-badge border flex-shrink-0">
                  <i class="bi bi-clock me-1"></i>
                  {{ recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : 'N/A' }}
                </span>
                <router-link :to="'/recipe/' + recipe.id" class="text-primary-custom fw-bold text-decoration-none small recipe-link">
                  View recipe <i class="bi bi-arrow-right"></i>
                </router-link>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-grid-3x3-gap text-muted mb-3 d-block empty-icon"></i>
        <h2 class="h4 text-muted">No recipes found.</h2>
        <p class="text-muted">Try choosing another category from the Dishes dropdown.</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import LayeredLoader from './LayeredLoader.vue'
import { computed, onMounted, ref, watch } from 'vue'
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

const categories = {
  primi: { title: 'First Courses', description: 'Pasta, risotti, gnocchi and great classics to bring to the table as a first course.' },
  secondi: { title: 'Main Courses', description: 'Meat, fish and hearty recipes designed for the heart of the menu.' },
  contorni: { title: 'Side Dishes', description: 'Vegetables, salads and simple sides to pair with your favorite dishes.' },
  dolci: { title: 'Desserts', description: 'Spoon desserts, cakes and Italian sweets to end the meal with taste.' }
}

const currentCategory = computed(() => String(route.params.category || '').toLowerCase())
const categoryData = computed(() => categories[currentCategory.value] || { title: 'Dishes', description: 'Explore the recipes available for this category.' })
const categoryTitle = computed(() => categoryData.value.title)
const categoryDescription = computed(() => categoryData.value.description)

const handleImageError = (event) => { event.target.style.display = 'none' }

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

const fetchCategoryRecipes = async () => {
  loading.value = true; recipes.value = []
  try { recipes.value = await api.getRecipesByDishCategory(currentCategory.value, 24) } finally { loading.value = false }
}

onMounted(() => {
  fetchCategoryRecipes()
  
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (user) {
      try {
        await ensureUserProfile(user)
        favorites.value = await getFavoriteIds(user.uid)
        await fetchCategoryRecipes()
      } catch (err) {
        console.error("Errore nel caricamento dei preferiti", err)
      }
    } else {
      favorites.value = []
    }
  })
})

watch(() => route.params.category, fetchCategoryRecipes)
</script>

<style scoped>
.dish-category-view { background-color: var(--color-background); }
.category-header { padding-top: 1.5rem; }
.back-link, .recipe-link { color: var(--color-primary-theme); }
.card-image-wrap { width: 100%; height: 220px; overflow: hidden; line-height: 0; }
.category-image { display: block; width: calc(100% + 16px); margin-left: -8px; height: 100%; object-fit: cover; object-position: center; transform: scale(1.08); transform-origin: center; }
.category-icon-button { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
.category-time-badge { background-color: var(--color-navbar); color: var(--color-text-primary); border-color: var(--color-border); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.empty-icon { font-size: 3rem; }
</style>

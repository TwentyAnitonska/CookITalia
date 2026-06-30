<template>
  <main class="favorites-view min-vh-100 py-5 mt-5">
    <div class="container">
      <div class="favorites-header border-bottom pb-4 mb-5">
        <router-link to="/" class="back-link text-decoration-none fw-semibold small d-inline-flex align-items-center gap-2 mb-3">
          <i class="bi bi-arrow-left"></i>
          Home
        </router-link>
        <h1 class="fw-bold mb-2">My Favorites</h1>
        <p class="text-muted mb-0">Here are all the recipes you have saved with a heart.</p>
      </div>

      <div v-if="loading" class="block-loader">
        <LayeredLoader class="loader-logo" />
        <h4 class="fw-bold text-uppercase loader-text">
          <span class="hero-logo-cook">Cook</span><span class="hero-logo-it">IT</span><span class="hero-logo-alia">alia</span>
        </h4>
      </div>

      <div v-else-if="!currentUser" class="text-center py-5">
        <i class="bi bi-lock text-muted mb-3 d-block empty-icon"></i>
        <h2 class="h4 text-muted">Authentication Required</h2>
        <p class="text-muted">Please log in or register to view your favorite recipes.</p>
      </div>

      <div v-else>
        <div class="row mb-4" v-if="favoriteRecipes.length > 0">
          <div class="col-md-6 col-lg-4">
            <div class="google-style-search">
              <span class="search-icon-wrap">
                <i class="bi bi-search"></i>
              </span>
              <input
                type="text"
                class="search-input-field"
                placeholder="Filter favorites..."
                v-model="searchQuery"
              />
            </div>
          </div>
        </div>

        <div v-if="filteredRecipes.length > 0" class="row g-4">
          <div class="col-12 col-md-6 col-lg-4" v-for="recipe in filteredRecipes" :key="recipe.id">
            <article class="card h-100 slide-card rounded-4 overflow-hidden position-relative border-0 shadow-sm">
              <button
                class="btn favorite-btn-remove rounded-circle position-absolute top-0 end-0 m-3 shadow-sm z-1"
                @click="removeFavorite(recipe.id)"
                aria-label="Remove from favorites"
              >
                <i class="bi bi-heart-fill"></i>
              </button>

              <div class="card-image-wrap">
                <img :src="recipe.image" class="card-img-top favorite-image" :alt="recipe.title" @error="handleImageError">
              </div>

              <div class="card-body p-4 d-flex flex-column">
                <span v-if="recipe.recipeTypeLabel" class="badge recipe-type-badge align-self-start mb-3">
                  {{ recipe.recipeTypeLabel }}
                </span>
                <h2 class="card-title fw-bold mb-2 h5">{{ recipe.title }}</h2>
                <div class="d-flex justify-content-between align-items-center gap-3 mt-auto pt-3">
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
          <i class="bi bi-heartbreak text-muted mb-3 d-block empty-icon"></i>
          <h2 class="h4 text-muted">No favorite recipes found.</h2>
          <p class="text-muted" v-if="searchQuery">Try adjusting your search query.</p>
          <p class="text-muted" v-else>Browse our categories and add some recipes to your list!</p>
          <router-link to="/" class="btn btn-primary-custom mt-3 rounded-pill px-4" v-if="!searchQuery">Explore Recipes</router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import LayeredLoader from './LayeredLoader.vue'
import { ref, onMounted, computed } from 'vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { getFavoriteRecipes, removeRecipeFromFavorites } from '../services/api'

defineProps({
  isDarkMode: Boolean
})

const favoriteRecipes = ref([])
const loading = ref(true)
const currentUser = ref(null)
const searchQuery = ref('')

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const filteredRecipes = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return favoriteRecipes.value
  return favoriteRecipes.value.filter(recipe => 
    (recipe.title || '').toLowerCase().includes(query) ||
    (recipe.recipeTypeLabel || '').toLowerCase().includes(query)
  )
})

const removeFavorite = async (recipeId) => {
  if (!currentUser.value) return
  try {
    await removeRecipeFromFavorites(currentUser.value.uid, recipeId)
    favoriteRecipes.value = favoriteRecipes.value.filter(r => r.id !== recipeId)
  } catch (err) {
    console.error("Errore nella rimozione dai preferiti", err)
  }
}

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (user) {
      try {
        favoriteRecipes.value = await getFavoriteRecipes(user.uid)
      } catch (err) {
        console.error("Errore nel caricamento dei preferiti", err)
      }
    } else {
      favoriteRecipes.value = []
    }
    loading.value = false
  })
})
</script>

<style scoped>
.favorites-view { background-color: var(--color-background); }
.favorites-header { padding-top: 1.5rem; }
.back-link, .recipe-link { color: var(--color-primary-theme); }
.back-link:hover, .recipe-link:hover { color: var(--color-primary-theme-hover); }
.card-image-wrap { width: 100%; height: 220px; overflow: hidden; line-height: 0; }
.favorite-image { display: block; width: calc(100% + 16px); margin-left: -8px; height: 100%; object-fit: cover; object-position: center; transform: scale(1.08); transform-origin: center; }
.favorite-btn-remove { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: none; }
.category-time-badge { background-color: var(--color-navbar); color: var(--color-text-primary); border-color: var(--color-border); }
.empty-icon { font-size: 3.5rem; }

/* ==========================================================================
   NUOVA BARRA DI RICERCA REGOLATA (STILE GOOGLE: BASSA E SENZA TENDINA/ROSSO)
   ========================================================================== */
.google-style-search {
  display: flex;
  align-items: center;
  background-color: var(--color-navbar);
  border: 1px solid var(--color-border);
  border-radius: 24px; /* Angoli tondi fluidi */
  padding: 0 14px;
  height: 38px; /* Altezza ridotta rispetto alla Navbar principale */
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

/* Icona della lente senza sfondi aggiuntivi o distorsioni */
.search-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-right: 10px;
  background: transparent;
  border: none;
}

/* Campo di input completamente ripulito dai reset nativi di Bootstrap */
.search-input-field {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  height: 100%;
  padding: 0;
  outline: none;
  box-shadow: none;
}

/* Rimuove qualsiasi outline o effetto rosso residuo al clic */
.search-input-field:focus {
  outline: none;
  box-shadow: none;
  background: transparent;
}
</style>

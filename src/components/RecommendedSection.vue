<template>
  <section class="py-5" id="esplora">
    <div class="container">
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 class="fw-bold mb-1">Recommended for you</h2>
          <p class="text-muted mb-0">Discover the most loved dishes, chosen based on your tastes.</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn carousel-button rounded-circle shadow-sm" @click="prevSlide" aria-label="Previous">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button class="btn carousel-button rounded-circle shadow-sm" @click="nextSlide" aria-label="Next">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div class="carousel-viewport position-relative overflow-hidden">
        <div
          class="d-flex transition-transform"
          :style="{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            transition: 'transform 0.5s ease-in-out'
          }"
        >
          <div
            v-for="recipe in recipes"
            :key="recipe.id"
            class="slide-item flex-shrink-0 px-2"
            :style="{ width: `${100 / visibleItems}%` }"
          >
            <div class="card h-100 slide-card rounded-4 overflow-hidden position-relative" @mouseenter="pauseInterval" @mouseleave="startInterval">
              <button
                      class="btn carousel-button heart-btn rounded-circle position-absolute top-0 end-0 m-3 shadow-sm z-1"
                      :class="{ 'is-favorite': favorites.includes(Number(recipe.id)) }"
                      @click="handleFavoriteClick(recipe, $event)"
                      style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                <i class="favorite-heart bi" :class="favorites.includes(Number(recipe.id)) ? 'bi-heart-fill' : 'bi-heart'"></i>
              </button>
              <div class="card-image-wrap">
                <img :src="recipe.image" class="card-img-top recommended-image" alt="recipe">
              </div>
              <div class="card-body p-4">
                <span v-if="recipe.recipeTypeLabel" class="badge recipe-type-badge mb-3">
                  {{ recipe.recipeTypeLabel }}
                </span>
                <h5 class="card-title fw-bold mb-2">{{ recipe.title }}</h5>
                <p class="card-text text-muted small mb-3 line-clamp-2">{{ recipe.summary }}</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                  <span class="badge recipe-time-badge border"><i class="bi bi-clock me-1"></i> {{ recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : 'N/A' }}</span>
                  <router-link :to="'/recipe/' + recipe.id" class="text-primary-custom fw-bold text-decoration-none small">View recipe <i class="bi bi-arrow-right"></i></router-link>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import api from '../services/api'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ensureUserProfile, getFavoriteIds, toggleFavoriteRecipe, getFavoriteRecipes } from '../services/api'

const recipes = ref([])
const currentIndex = ref(0)
const favorites = ref([])
const currentUser = ref(null)
let slideInterval = null

const windowWidth = ref(window.innerWidth)
const visibleItems = computed(() => {
  if (windowWidth.value >= 1200) return 3
  return 1
})

const onResize = () => {
  windowWidth.value = window.innerWidth
  if (currentIndex.value > maxIndex.value) { currentIndex.value = maxIndex.value }
}

const maxIndex = computed(() => Math.max(0, recipes.value.length - visibleItems.value))

const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) { currentIndex.value++ } else { currentIndex.value = 0 }
  resetInterval()
}

const prevSlide = () => {
  if (currentIndex.value > 0) { currentIndex.value-- } else { currentIndex.value = maxIndex.value }
  resetInterval()
}

const toggleFavorite = async (recipe) => {
  if (!currentUser.value) return

  try {
    favorites.value = await toggleFavoriteRecipe(currentUser.value.uid, recipe, favorites.value)
  } catch (err) {
    console.error("Errore nell'aggiornamento dei preferiti", err)
  }
}

const handleFavoriteClick = async (recipe, event) => {
  if (!currentUser.value) {
    alert("Please login or register first to save your favorites!")
    return
  }
  await toggleFavorite(recipe)
  const btn = event.currentTarget
  btn.classList.add('spark-anim')
  
  for (let i = 0; i < 6; i++) {
    const spark = document.createElement('span')
    spark.classList.add('custom-spark')
    const angle = (i / 6) * Math.PI * 2
    spark.style.setProperty('--x', `${Math.cos(angle) * 25}px`)
    spark.style.setProperty('--y', `${Math.sin(angle) * 25}px`)
    btn.appendChild(spark)
    setTimeout(() => spark.remove(), 400)
  }
  setTimeout(() => btn.classList.remove('spark-anim'), 400)
}

const pauseInterval = () => { if (slideInterval) clearInterval(slideInterval) }
const startInterval = () => {
  if (slideInterval) clearInterval(slideInterval)
  slideInterval = setInterval(() => { nextSlide() }, 5000)
}
const resetInterval = () => { pauseInterval(); startInterval() }

onMounted(async () => {
  recipes.value = await api.getRecommended()
  window.addEventListener('resize', onResize)
  startInterval()

  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (user) {
      try {
        await ensureUserProfile(user)
        favorites.value = await getFavoriteIds(user.uid)
        
        // Carica raccomandazioni personalizzate basate sui preferiti
        const favsList = await getFavoriteRecipes(user.uid)
        recipes.value = await api.getRecommended(favsList)
      } catch (err) {
        console.error("Errore nel caricamento dei preferiti", err)
      }
    } else {
      favorites.value = []
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<style scoped>
.carousel-viewport { margin: 0 -0.5rem; }
.transition-transform { width: 100%; }
.slide-item { min-width: 0; }
.card-image-wrap { width: 100%; height: 220px; overflow: hidden; line-height: 0; }
.recommended-image { display: block; width: calc(100% + 16px); margin-left: -8px; height: 100%; object-fit: cover; object-position: center; transform: scale(1.08); transform-origin: center; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.recipe-time-badge { background-color: var(--color-navbar); color: var(--color-text-primary); border-color: var(--color-border); }

@keyframes spark-explosion {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
}
:deep(.custom-spark) {
  position: absolute;
  width: 5px;
  height: 5px;
  background: var(--favorite-accent);
  border-radius: 50%;
  animation: spark-explosion 0.4s ease-out forwards;
}
</style>

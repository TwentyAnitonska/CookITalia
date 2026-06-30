<template>
  <section class="py-5 my-5">
    <div class="container">
      <div class="recipe-banner rounded-4 overflow-hidden position-relative shadow-lg" v-if="recipe">
        <div class="row g-0 align-items-center">
          <div class="col-md-6 order-md-2 h-100">
            <img :src="recipe.image" alt="Ricetta del giorno" class="img-fluid w-100 object-fit-cover banner-img">
          </div>
          
          <div class="col-md-6 order-md-1 position-relative z-1 p-5 banner-content">
            <div class="recipe-day-badge badge mb-3 px-3 py-2 rounded-pill fw-bold">
              <i class="bi bi-star-fill me-1"></i> Recipe of the Day
            </div>
            
            <h2 class="display-5 fw-bold banner-title mb-3">{{ recipe.title }}</h2>
            
            <div class="d-flex gap-3 mb-4 banner-meta">
              <span v-if="recipe.recipeTypeLabel"><i class="bi bi-bookmark-fill me-1"></i> {{ recipe.recipeTypeLabel }}</span>
            </div>
            
            <p class="banner-summary lead mb-4 fw-light line-clamp-3">
              {{ recipe.summary }}
            </p>
            
            <router-link :to="'/recipe/' + recipe.id" class="btn recipe-banner-button btn-lg rounded-pill px-4 fw-bold">
              Cook now <i class="bi bi-arrow-right ms-2"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const recipe = ref(null)
onMounted(async () => { recipe.value = await api.getRecipeOfTheDay() })
</script>

<style scoped>
.recipe-banner {
  background: linear-gradient(135deg, var(--color-recipe-banner-gradient-start) 0%, var(--color-recipe-banner-gradient-end) 100%);
}
.recipe-day-badge { background-color: var(--color-primary-theme-hover); color: var(--color-white-logo); }
.banner-title,
.banner-summary {
  color: var(--color-text-inverse);
}
.banner-meta {
  color: color-mix(in srgb, var(--color-text-inverse) 70%, transparent);
}
.recipe-banner-button { background-color: var(--color-btn-bg); color: var(--color-primary-theme); border: 1px solid var(--color-primary-theme); }
.recipe-banner-button:hover { background-color: var(--color-primary-theme); border-color: var(--color-primary-theme); color: var(--color-white-logo); }
.recipe-banner-button:active { background-color: var(--color-btn-bg); border-color: var(--color-primary-theme); color: var(--color-primary-theme); }
.banner-img { height: 100%; min-height: 400px; clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%); }
@media (max-width: 767.98px) { .banner-img { clip-path: none; height: 250px; } }
.line-clamp-3 { display: -webkit-box; line-clamp: 3; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

</style>

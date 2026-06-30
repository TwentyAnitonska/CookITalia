<template>
  <div class="recipe-detail py-5" v-if="recipe">
    <div class="container pt-4">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1 class="recipe-title mb-0">{{ recipe.title }}</h1>
        <button
          class="btn detail-favorite-btn rounded-circle shadow-sm"
          :class="{ 'is-favorite': isFavorite }"
          @click="handleFavoriteClick($event)"
          aria-label="Add to favorites"
          style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;"
        >
          <i class="favorite-heart bi fs-4" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
        </button>
      </div>
      
      <div class="row g-4 mb-5">
        <div class="col-lg-8">
          <div class="recipe-image-container rounded-4 shadow-sm overflow-hidden h-100 d-flex align-items-center">
            <img :src="recipe.image" :alt="recipe.title" class="w-100 img-fluid" style="object-fit: cover; max-height: 600px;" />
          </div>
        </div>
        
        <div class="col-lg-4">
          <div class="recipe-info-card rounded-4 p-4 d-flex flex-column">
            <div class="mb-4">
               <div class="d-flex justify-content-between align-items-center mb-3">
                 <div class="d-flex align-items-center gap-2">
                   <span class="badge recipe-badge rounded-pill">
                     {{ getCaloriesLabel() }}
                   </span>
                 </div>
               </div>
               
               <div class="d-flex flex-wrap gap-2 mt-3 mb-4">
                 <span class="badge recipe-tag rounded-pill d-flex align-items-center gap-2 px-3 py-2 fw-medium" v-if="getRecipeType() !== unavailableLabel">
                   <i class="bi bi-bookmark"></i> {{ getRecipeType() }}
                 </span>
                 <span
                   v-for="tag in dietaryTags"
                   :key="tag.label"
                   class="badge recipe-tag rounded-pill d-flex align-items-center gap-2 px-3 py-2 fw-medium"
                 >
                   <i class="bi" :class="tag.icon"></i> {{ tag.label }}
                 </span>
               </div>
            </div>

            <div class="recipe-meta-card rounded-4 p-4 shadow-sm mt-auto">
              <ul class="list-unstyled mb-0 d-flex flex-column gap-3">
                <li class="d-flex align-items-center gap-3">
                  <i class="recipe-meta-icon bi bi-award"></i>
                  <span>Difficulty: <span class="recipe-meta-value fw-bold">{{ getDifficulty() }}</span></span>
                </li>
                <li class="d-flex align-items-center gap-3">
                  <i class="recipe-meta-icon bi bi-clock"></i>
                  <span>Preparation: <span class="recipe-meta-value fw-bold">{{ getPreparationTime() }}</span></span>
                </li>
                <li class="d-flex align-items-center gap-3">
                  <i class="recipe-meta-icon bi bi-fire"></i>
                  <span>Cooking: <span class="recipe-meta-value fw-bold">{{ getCookingTime() }}</span></span>
                </li>
                <li class="d-flex align-items-center gap-3">
                  <i class="recipe-meta-icon bi bi-cup"></i>
                  <span>Servings: <span class="recipe-meta-value fw-bold">{{ getServings() }}</span></span>
                </li>
                <li class="d-flex align-items-center gap-3">
                  <i class="recipe-meta-icon bi bi-coin"></i>
                  <span>Cost: <span class="recipe-meta-value fw-bold">{{ getCost() }}</span></span>
                </li>
                <li class="d-flex align-items-center gap-3">
                  <i class="recipe-meta-icon bi bi-list-check"></i>
                  <span>Ingredients: <span class="recipe-meta-value fw-bold">{{ getIngredientsCount() }}</span></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container my-5">
      <div class="ingredients-section mb-5 p-5 rounded-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-4 mb-5">
          <div class="position-relative">
            <h2 class="section-title mb-0 text-uppercase">Ingredients</h2>
            <div class="section-rule"></div>
          </div>
        </div>

        <div class="row g-4" v-if="recipe.extendedIngredients && recipe.extendedIngredients.length > 0">
          <div class="col-md-6" v-for="ing in recipe.extendedIngredients" :key="ing.id">
            <div class="d-flex align-items-start gap-3">
              <i class="ingredient-dot bi bi-circle"></i>
              <span class="ingredient-text">
                <span class="ingredient-name fw-bold">{{ getIngredientName(ing) }}</span>
                {{ getIngredientAmount(ing) }}
              </span>
            </div>
          </div>
        </div>
        <p v-else class="text-muted">No ingredients listed.</p>
      </div>

      <div class="row g-5">
        <div class="col-12">
          <div class="position-relative mb-5 border-bottom pb-3">
            <h3 class="section-title mb-0 text-uppercase">Instructions</h3>
            <div class="section-rule"></div>
          </div>
          
          <div v-if="recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0">
            <div v-for="(instruction, index) in recipe.analyzedInstructions" :key="index" class="mb-5">
              <h4 v-if="instruction.name" class="mb-3">{{ instruction.name }}</h4>
              
              <div class="step-list">
                <div v-for="step in instruction.steps" :key="step.number" class="step-card mb-4 p-4 rounded shadow-sm d-flex flex-column flex-md-row gap-4">
                  <div class="step-number d-flex align-items-center justify-content-center rounded-circle flex-shrink-0">
                    <span class="fs-4 fw-bold">{{ step.number }}</span>
                  </div>
                  <div class="step-content flex-grow-1">
                    <p class="fs-5 mb-3">{{ step.step }}</p>
                    
                    <div v-if="step.ingredients && step.ingredients.length > 0" class="mt-4 pt-3 border-top">
                      <h6 class="step-ingredients-title fw-bold mb-3">Ingredients to use:</h6>
                      <div class="d-flex gap-2 flex-wrap">
                        <template v-for="ing in step.ingredients" :key="'ing-'+ing.id">
                          <span v-if="getIngredientName(ing)" class="badge recipe-tag rounded-pill">
                            {{ getIngredientName(ing) }}
                          </span>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p class="text-muted">No detailed instructions available for this recipe.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else-if="loading" class="splash-overlay d-flex flex-column align-items-center justify-content-center" :class="{ 'dark-mode': isDarkMode }">
    <div class="text-center">
      <LayeredLoader class="splash-logo mb-5" />
      <h2 class="brand-text m-0 splash-text">
        <span class="hero-logo-cook">Cook</span><span class="hero-logo-it">IT</span><span class="hero-logo-alia">alia</span>
      </h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import LayeredLoader from './LayeredLoader.vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ensureUserProfile, getFavoriteIds, toggleFavoriteRecipe } from '../services/api'

defineProps({
  isDarkMode: Boolean
})

const route = useRoute()
const recipe = ref(null)
const loading = ref(true)
const favorites = ref([])
const currentUser = ref(null)

const isFavorite = computed(() => {
  return recipe.value && favorites.value.includes(Number(recipe.value.id))
})

const toggleFavorite = async () => {
  if (!currentUser.value || !recipe.value) return
  try {
    favorites.value = await toggleFavoriteRecipe(currentUser.value.uid, recipe.value, favorites.value)
  } catch (err) {
    console.error("Errore nell'aggiornamento dei preferiti", err)
  }
}

const handleFavoriteClick = async (event) => {
  if (!currentUser.value) {
    alert("Please login or register first to save your favorites!")
    return
  }
  await toggleFavorite()
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

const fetchRecipe = async (id) => {
  loading.value = true; recipe.value = null
  if (id) { recipe.value = await api.getRecipeById(id) }
  loading.value = false
}

onMounted(() => { 
  fetchRecipe(route.params.id) 
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (user) {
      try {
        await ensureUserProfile(user)
        favorites.value = await getFavoriteIds(user.uid)
      } catch (err) {
        console.error("Errore nel caricamento dei preferiti", err)
      }
    } else {
      favorites.value = []
    }
  })
})

watch(() => route.params.id, (newId) => { if (newId) fetchRecipe(newId) })

const getIngredientName = (ing) => {
  let name = ing.nameClean || ing.name || ing.originalName || '';
  if (!name && ing.original) name = ing.original.split(' ').slice(1).join(' ');
  if (name) {
    const modifiers = ['spalmabile', 'tritato', 'tritata', 'fuso', 'fusa', 'a dadini', 'fresco', 'fresca', 'caldo', 'calda', 'freddo', 'fredda', 'tagliato', 'tagliata', 'a fette', 'grattugiato', 'grattugiata', 'cotto', 'cotta', 'crudo', 'cruda', 'sgocciolato', 'sgocciolata', 'a pezzi', 'a cubetti', 'macinato', 'macinata'];
    const regex = new RegExp(`\\b(${modifiers.join('|')})\\b`, 'gi');
    name = name.replace(regex, '').replace(/\s+/g, ' ').trim();
    name = name.replace(/^(di|con|per)\s+/i, '').replace(/\s+(di|con|per)$/i, '').trim();
  }
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
};

const getIngredientAmount = (ing) => {
  if (ing.measures && ing.measures.metric) {
    let amount = Math.round(ing.measures.metric.amount * 10) / 10;
    let unit = ing.measures.metric.unitShort;
    if (unit === 'Tbsps' || unit === 'Tbstore') unit = amount <= 1 ? 'cucchiaio' : 'cucchiai';
    if (unit === 'tsps' || unit === 'tsp') unit = amount <= 1 ? 'cucchiaino' : 'cucchaini';
    if (unit === 'cups' || unit === 'cup') unit = amount <= 1 ? 'tazza' : 'tazze';
    if (unit === 'slices' || unit === 'slice') unit = amount <= 1 ? 'fetta' : 'fette';
    if (unit === 'cloves' || unit === 'clove') unit = amount <= 1 ? 'spicchio' : 'spicchi';
    if (unit === 'pinches' || unit === 'pinch') unit = amount <= 1 ? 'pizzico' : 'pizzichi';
    if (unit === 'leaves' || unit === 'leaf') unit = amount <= 1 ? 'foglia' : 'foglie';
    if (unit === 'servings' || unit === 'serving') return 'q.b.';
    return `${amount} ${unit}`.trim();
  }
  return '';
};

const unavailableLabel = 'N/A';
const dietaryTagOptions = [
  { key: 'vegetarian', label: 'Vegetarian', icon: 'bi-flower1' },
  { key: 'vegan', label: 'Vegan', icon: 'bi-leaf' },
  { key: 'glutenFree', label: 'Gluten free', icon: 'bi-shield-check' },
  { key: 'dairyFree', label: 'Dairy free', icon: 'bi-cup-straw' }
];
const dietaryTags = computed(() => {
  if (!recipe.value) return [];
  return dietaryTagOptions.filter(tag => recipe.value[tag.key]);
});
const getCaloriesLabel = () => {
  if (recipe.value?.nutrition?.nutrients) {
    const calories = recipe.value.nutrition.nutrients.find(n => n.name === 'Calories');
    if (calories) return `${calories.amount.toFixed(1).replace('.', ',')} Kcal/serving`;
  }
  return `0,0 Kcal/serving`;
};
const getRecipeType = () => recipe.value?.recipeTypeLabel || unavailableLabel;
const getServings = () => recipe.value?.servings ? `${recipe.value.servings} servings` : unavailableLabel;
const getIngredientsCount = () => recipe.value?.extendedIngredients?.length ? `${recipe.value.extendedIngredients.length}` : unavailableLabel;
const getPreparationTime = () => recipe.value?.preparationMinutes ? `${recipe.value.preparationMinutes} min` : (recipe.value?.readyInMinutes ? `${Math.round(recipe.value.readyInMinutes * 0.6)} min` : unavailableLabel);
const getCookingTime = () => recipe.value?.cookingMinutes ? `${recipe.value.cookingMinutes} min` : (recipe.value?.readyInMinutes ? `${Math.round(recipe.value.readyInMinutes * 0.4)} min` : unavailableLabel);
const getDifficulty = () => recipe.value?.readyInMinutes ? (recipe.value.readyInMinutes <= 30 ? 'Easy' : (recipe.value.readyInMinutes <= 60 ? 'Medium' : 'Hard')) : unavailableLabel;
const getCost = () => recipe.value?.pricePerServing ? (recipe.value.pricePerServing < 100 ? 'Low' : (recipe.value.pricePerServing < 300 ? 'Medium' : 'High')) : unavailableLabel;
</script>

<style scoped>
.recipe-detail { min-height: 100vh; background-color: var(--color-background); }
.recipe-title { color: var(--color-text-primary); font-size: 3rem; font-weight: 800; }
.recipe-image-container, .recipe-info-card, .ingredients-section, .step-card { background-color: var(--color-navbar); border: 1px solid var(--color-border); }
.recipe-badge { background-color: var(--color-primary-theme); color: var(--color-navbar); font-size: 0.9rem; font-weight: 600; padding: 0.4em 0.8em; }
.recipe-label, .recipe-meta-card, .ingredient-text { color: var(--color-text-primary); font-weight: 500; }
.recipe-label { font-size: 0.95rem; font-weight: 600; }
.recipe-tag { font-size: 0.85rem; font-weight: 500; padding: 0.5em 1em; }
.recipe-meta-card { background-color: var(--color-background); }
.recipe-meta-value { color: var(--color-text-primary); }
.recipe-meta-icon { color: var(--color-primary-theme); font-size: 1.2rem; width: 24px; }
.section-title { color: var(--color-text-primary); font-size: 1.8rem; font-weight: 500; }
.section-rule { background-color: var(--color-primary-theme); height: 3px; margin-top: 10px; width: 60px; }
.ingredient-dot { color: var(--color-primary-theme); font-size: 0.5rem; margin-top: 8px; }
.ingredient-text { font-size: 1.1rem; }
.ingredient-name { text-decoration: underline; text-decoration-color: var(--color-primary-theme); text-underline-offset: 4px; }
.step-ingredients-title { color: var(--color-text-secondary); font-size: 0.85rem; text-transform: uppercase; }
.step-card { transition: transform 0.2s ease; color: var(--color-text-primary); }
.step-card:hover { transform: translateY(-2px); }
.step-number { background-color: var(--color-primary-theme); color: var(--color-navbar); width: 50px; height: 50px; }
.detail-favorite-btn {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

@keyframes spark-explosion {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
}
:deep(.custom-spark) {
  position: absolute;
  width: 5px;
  height: 5px;
  background: var(--color-primary-theme);
  border-radius: 50%;
  animation: spark-explosion 0.4s ease-out forwards;
}
</style>

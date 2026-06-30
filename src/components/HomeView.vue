<template>
  <main class="home-view">
    <HeroSection />
    <PopularCategories />
    <RecommendedSection />
    <RecipeOfTheDay />
  </main>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'
import PopularCategories from '../components/PopularCategories.vue'
import RecommendedSection from '../components/RecommendedSection.vue'
import RecipeOfTheDay from '../components/RecipeOfTheDay.vue'
</script>
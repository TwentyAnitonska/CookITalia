<template>
  <section class="py-4 category-section">
    <div class="container-fluid popular-categories-container text-center">
      <h3 class="fw-bold mb-4">Popular Categories</h3>
      
      <div class="d-flex flex-wrap justify-content-center gap-3">
        <div class="category-pill-custom shadow-sm" v-for="cat in categories" :key="cat.name" @click="searchCategory(cat.name)">
          <i class="bi" :class="cat.icon"></i>
          <span>{{ cat.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchCategory = (name) => {
  router.push({ name: 'search', query: { q: name } })
}

const categories = ref([
  { name: 'Pasta', icon: 'bi-bezier2' },
  { name: 'Pizza', icon: 'bi-pie-chart' },
  { name: 'Meat', icon: 'bi-fire' },
  { name: 'Fish', icon: 'bi-water' },
  { name: 'Vegetarian', icon: 'bi-flower1' },
  { name: 'Vegan', icon: 'bi-leaf' },
  { name: 'Gluten Free', icon: 'bi-shield-check' },
  { name: 'Dairy Free', icon: 'bi-cup-straw' }
])
</script>

<style scoped>
.category-section {
  background-color: var(--color-navbar);
}
.popular-categories-container {
  padding-left: 12px;
  padding-right: 12px;
}
.category-pill-custom {
  background-color: var(--color-btn-bg);
  color: var(--color-primary-theme);
  border: 1px solid var(--color-primary-theme);
  border-radius: 50px;
  padding: 10px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.category-pill-custom i {
  color: var(--color-primary-theme);
}
.category-pill-custom:hover {
  background-color: var(--color-primary-theme);
  color: var(--color-white-logo);
  border-color: var(--color-primary-theme);
  transform: translateY(-2px);
}
.category-pill-custom:hover i {
  color: var(--color-white-logo);
}
</style>

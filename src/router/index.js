import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import RecipeDetailView from '../components/RecipeDetailView.vue'
import SearchResultsView from '../components/SearchResultsView.vue'
import DishCategoryView from '../components/DishCategoryView.vue'

import FavoritesView from '../components/FavoritesView.vue'
import SettingsView from '../components/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/recipe/:id',
      name: 'recipe-detail',
      component: RecipeDetailView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchResultsView
    },
    {
      path: '/piatti/:category',
      name: 'dish-category',
      component: DishCategoryView
    },

    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router

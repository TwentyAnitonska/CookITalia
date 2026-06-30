<template>
  <div 
    class="modal-overlay d-flex align-items-center justify-content-center" 
    @mousedown.self="startClose" 
    @mouseup.self="endClose"
  >
    <div class="modal-card p-4 rounded-4 shadow position-relative">
      <button @click="$emit('close')" class="btn-close position-absolute top-0 end-0 m-3"></button>
      
      <h3 class="fw-bold mb-4 text-center">{{ isLogin ? 'Login' : 'Register' }}</h3>
      
      <form @submit.prevent="handleSubmit" autocomplete="off">
        <input class="autofill-decoy" type="text" name="email" autocomplete="username" tabindex="-1" aria-hidden="true">
        <input class="autofill-decoy" type="password" name="password" autocomplete="current-password" tabindex="-1" aria-hidden="true">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="form-control" 
            required 
            placeholder="name@example.com"
            :name="`${isLogin ? 'login' : 'signup'}-email-${autocompleteNonce}`"
            autocomplete="new-password"
            :readonly="preventAutofill"
            autocapitalize="none"
            spellcheck="false"
            @pointerdown="unlockFields"
            @focus="unlockFields"
          >
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-control" 
            required 
            placeholder="••••••••"
            :name="`${isLogin ? 'login' : 'signup'}-password-${autocompleteNonce}`"
            autocomplete="new-password"
            :readonly="preventAutofill"
            @pointerdown="unlockFields"
            @focus="unlockFields"
          >
        </div>

        <div v-if="!isLogin" class="mb-3">
          <label class="form-label">Nickname</label>
          <input 
            v-model="nickname" 
            type="text" 
            class="form-control" 
            required 
            placeholder="Your name"
            :name="`signup-nickname-${autocompleteNonce}`"
            autocomplete="new-password"
          >
        </div>
        
        <button type="submit" class="btn btn-auth-submit w-100 rounded-pill py-2 mb-3" :disabled="loading">
          <LayeredLoader v-if="loading" class="loader-logo-button me-2" />
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
        
        <div class="text-center">
          <a @click.prevent="toggleMode" href="#" class="text-decoration-none auth-toggle-link">
            {{ isLogin ? "Don't have an account? Register" : 'Already have an account? Login' }}
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import LayeredLoader from './LayeredLoader.vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { ensureUserProfile } from '../services/api'

defineProps({
  isDarkMode: Boolean
})

const emit = defineEmits(['close'])
const router = useRouter()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const nickname = ref('')
const loading = ref(false)
const preventAutofill = ref(true)
const autocompleteNonce = Math.random().toString(36).slice(2)

let clickStartedOnOverlay = false

const startClose = () => {
  clickStartedOnOverlay = true
}

const endClose = () => {
  if (clickStartedOnOverlay) {
    emit('close')
  }
  clickStartedOnOverlay = false
}

const clearAuthFields = () => {
  email.value = ''
  password.value = ''
}

const resetAutofillGuard = async () => {
  preventAutofill.value = true
  clearAuthFields()
  await nextTick()
  window.setTimeout(clearAuthFields, 80)
  window.setTimeout(clearAuthFields, 250)
}

const unlockFields = () => {
  preventAutofill.value = false
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  clearAuthFields()
  nickname.value = ''
  resetAutofillGuard()
}

onMounted(resetAutofillGuard)

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value)
      router.push('/')
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
      const user = userCredential.user
      try {
        await ensureUserProfile(user, { nickname: nickname.value, email: email.value })
      } catch (dbErr) {
        console.warn("Database save timed out or failed. Auth registration completed.", dbErr)
      }
      router.push('/')
    }
    emit('close')
  } catch (error) { alert(error.message) } finally { loading.value = false }
}
</script>

<style scoped>
.modal-overlay { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100vw; 
  height: 100vh; 
  background: var(--color-overlay-bg);
  z-index: 2000; 
  backdrop-filter: blur(4px); 
}
.modal-card { 
  width: 100%; 
  max-width: 400px; 
  background-color: var(--color-background); 
  color: var(--color-text-primary); 
}
.autofill-decoy {
  position: fixed;
  top: -100px;
  left: -100px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.form-control { 
  background-color: var(--color-background); 
  border-color: var(--color-border); 
  color: var(--color-text-primary); 
  transition: all 0.2s ease; 
}
.form-control:focus { 
  border-color: var(--color-primary-theme-hover); 
  box-shadow: 0 0 0 0.25rem var(--color-focus-ring);
}

/* Bottone di autenticazione (light mode) */
.btn-auth-submit {
  background-color: var(--color-background);
  border: 1px solid var(--color-primary-theme);
  color: var(--color-primary-theme);
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.btn-auth-submit:hover,
.btn-auth-submit:focus {
  background-color: var(--color-primary-theme);
  border-color: var(--color-primary-theme-hover);
  color: var(--color-text-inverse);
}
.btn-auth-submit:disabled {
  opacity: 0.65;
  pointer-events: none;
}

/* Link di switch (light mode) */
.auth-toggle-link { 
  color: var(--color-primary-theme); 
  transition: color 0.2s ease; 
}
.auth-toggle-link:hover { 
  color: var(--color-primary-theme-hover); 
}

/* Nota: dark mode per .btn-auth-submit, .auth-toggle-link e .form-control
   è gestita globalmente in style.css tramite .app-container.app-dark */
</style>

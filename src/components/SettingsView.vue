<template>
  <main class="settings-view min-vh-100 py-5 mt-5">
    <div class="container">
      <div class="settings-header border-bottom pb-4 mb-5">
        <router-link to="/" class="back-link text-decoration-none fw-semibold small d-inline-flex align-items-center gap-2 mb-3">
          <i class="bi bi-arrow-left"></i>
          Home
        </router-link>
        <h1 class="fw-bold mb-2">Settings</h1>
        <p class="text-muted mb-0">Configure your CookITalia preferences and manage your account.</p>
      </div>

      <div class="row g-4">
        <div class="col-lg-4">
          <div class="card settings-sidebar-card rounded-4 border-0 shadow-sm p-3">
            <div v-if="currentUser" class="text-center p-3 border-bottom mb-3">
              <div class="sidebar-photo-wrap mx-auto mb-3 shadow-sm">
                <img v-if="userProfile.photoBase64" :src="userProfile.photoBase64" alt="Profile" class="sidebar-photo">
                <i v-else class="bi bi-person-circle fs-1 text-muted"></i>
              </div>
              <h5 class="fw-bold mb-1">{{ userProfile.nickname || 'Cooker' }}</h5>
              <p class="text-muted small mb-0">{{ currentUser.email }}</p>
            </div>
            <div class="list-group list-group-flush settings-menu">
              <a href="#account" class="list-group-item list-group-item-action d-flex align-items-center gap-3 border-0 py-3 rounded-3" :class="{ active: activeTab === 'account' }" @click.prevent="activeTab = 'account'">
                <i class="bi bi-person-badge fs-5"></i> Account Summary
              </a>
              <a href="#dietary" class="list-group-item list-group-item-action d-flex align-items-center gap-3 border-0 py-3 rounded-3" :class="{ active: activeTab === 'dietary' }" @click.prevent="activeTab = 'dietary'">
                <i class="bi bi-egg-fried fs-5"></i> Dietary Preferences
              </a>
              <a href="#appearance" class="list-group-item list-group-item-action d-flex align-items-center gap-3 border-0 py-3 rounded-3" :class="{ active: activeTab === 'appearance' }" @click.prevent="activeTab = 'appearance'">
                <i class="bi bi-palette fs-5"></i> Appearance & Theme
              </a>
              <a href="#notifications" class="list-group-item list-group-item-action d-flex align-items-center gap-3 border-0 py-3 rounded-3" :class="{ active: activeTab === 'notifications' }" @click.prevent="activeTab = 'notifications'">
                <i class="bi bi-bell fs-5"></i> Notifications
              </a>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card settings-content-card rounded-4 border-0 shadow-sm p-4">
            
            <div v-if="activeTab === 'account'">
              <h3 class="fw-bold mb-4 d-flex align-items-center gap-2">
                <i class="bi bi-person-badge text-primary-custom"></i> Account Summary
              </h3>
              <div v-if="!currentUser" class="text-center py-4">
                <p class="text-muted">You are not logged in. Log in to manage your profile settings.</p>
              </div>
              <div v-else>
                <form class="account-profile-form mb-4" @submit.prevent="saveProfile">
                  <div class="row align-items-center g-4">
                    <div class="col-md-3 text-center">
                      <div class="profile-photo-circle mx-auto shadow-sm" @click="triggerFileInput">
                        <img v-if="previewPhoto" :src="previewPhoto" alt="Photo" class="w-100 h-100 object-fit-cover rounded-circle">
                        <i v-else class="bi bi-person-circle fs-1 text-muted"></i>
                        <div class="profile-photo-overlay">
                          <i class="bi bi-pencil-fill"></i>
                        </div>
                      </div>
                      <input ref="fileInputRef" type="file" class="d-none" accept="image/*" @change="handlePhotoChange">
                    </div>
                    <div class="col-md-9">
                      <div class="mb-3">
                        <label for="settings-email" class="form-label fw-semibold">Email Address</label>
                        <input id="settings-email" type="email" :value="currentUser.email" class="form-control rounded-pill disabled-email-input" disabled>
                        <div class="form-text">Your email address cannot be changed.</div>
                      </div>
                      <div class="mb-3">
                        <label for="settings-nickname" class="form-label fw-semibold">Nickname</label>
                        <input id="settings-nickname" type="text" v-model="nickname" class="form-control rounded-pill" placeholder="Choose a nickname" required>
                      </div>
                      <div v-if="profileMessage" class="alert alert-success rounded-pill py-2 text-center small mb-3" role="alert">
                        {{ profileMessage }}
                      </div>
                      <div v-if="profileError" class="alert alert-danger rounded-pill py-2 text-center small mb-3" role="alert">
                        {{ profileError }}
                      </div>
                      <button type="submit" class="btn btn-outline-primary-custom btn-sm rounded-pill px-4" :disabled="profileSaving || !hasProfileChanges">
                        <LayeredLoader v-if="profileSaving" class="loader-logo-button me-2" />
                        Save Profile
                      </button>
                    </div>
                  </div>
                </form>
                <div class="border-top pt-4">
                  <h5 class="fw-bold mb-3">Account Security</h5>
                  <div class="d-flex flex-wrap gap-2">
                    <button class="btn btn-reset-password-custom rounded-pill px-4 btn-sm" @click="resetPassword" :disabled="passwordLoading">
                      <LayeredLoader v-if="passwordLoading" class="loader-logo-button me-2" />
                      Reset Password via Email
                    </button>
                  </div>
                  <div class="form-text mt-2 text-muted">We will send a reset password link to your email address if requested.</div>
                  <div class="mt-3">
                    <button class="btn btn-danger-custom rounded-pill px-4 btn-sm" @click="deleteAccount" :disabled="deleteLoading">
                      <LayeredLoader v-if="deleteLoading" class="loader-logo-button me-2" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'dietary'">
              <h3 class="fw-bold mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-egg-fried text-primary-custom"></i> Dietary Preferences
              </h3>
              <p class="text-muted mb-4">Set your dietary preferences. Recommended recipes and searches will filter accordingly.</p>
              
              <div v-if="!currentUser" class="text-center py-4">
                <p class="text-muted">Please log in to save and apply dietary preferences.</p>
              </div>
              
              <div v-else>
                <div class="list-group list-group-flush mb-4">
                  <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3">
                    <div>
                      <h6 class="fw-bold mb-1 d-flex align-items-center gap-2">
                        <i class="bi bi-flower1 text-primary-custom"></i> Vegetarian
                      </h6>
                      <p class="text-muted small mb-0">No meat, poultry, or seafood products.</p>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input switch-custom" type="checkbox" role="switch" v-model="vegetarian" @change="savePreferences">
                    </div>
                  </div>
                  <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3">
                    <div>
                      <h6 class="fw-bold mb-1 d-flex align-items-center gap-2">
                        <i class="bi bi-leaf text-primary-custom"></i> Vegan
                      </h6>
                      <p class="text-muted small mb-0">No animal products including eggs, dairy, or honey.</p>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input switch-custom" type="checkbox" role="switch" v-model="vegan" @change="savePreferences">
                    </div>
                  </div>
                  <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3">
                    <div>
                      <h6 class="fw-bold mb-1 d-flex align-items-center gap-2">
                        <i class="bi bi-shield-check text-primary-custom"></i> Gluten Free
                      </h6>
                      <p class="text-muted small mb-0">Exclude recipes containing wheat, barley, rye, or gluten.</p>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input switch-custom" type="checkbox" role="switch" v-model="glutenFree" @change="savePreferences">
                    </div>
                  </div>
                  <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3">
                    <div>
                      <h6 class="fw-bold mb-1 d-flex align-items-center gap-2">
                        <i class="bi bi-cup-straw text-primary-custom"></i> Dairy Free
                      </h6>
                      <p class="text-muted small mb-0">Exclude recipes containing cow milk products or lactose.</p>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input switch-custom" type="checkbox" role="switch" v-model="dairyFree" @change="savePreferences">
                    </div>
                  </div>
                </div>

                <div v-if="saveMessage" class="alert alert-success rounded-pill py-2 text-center small mb-0" role="alert">
                  {{ saveMessage }}
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'appearance'">
              <h3 class="fw-bold mb-4 d-flex align-items-center gap-2">
                <i class="bi bi-palette text-primary-custom"></i> Appearance & Theme
              </h3>
              <div class="list-group list-group-flush mb-4">
                <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3">
                  <div>
                    <h6 class="fw-bold mb-1">Dark Mode</h6>
                    <p class="text-muted small mb-0">Switch between standard light layout and premium dark colors.</p>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input switch-custom" type="checkbox" role="switch" :checked="isDarkMode" @change="$emit('toggle-theme')">
                  </div>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3">
                  <div>
                    <h6 class="fw-bold mb-1">Measurement System</h6>
                    <p class="text-muted small mb-0">Choose units for recipe measurements (ingredients quantity).</p>
                  </div>
                  <div>
                    <div class="settings-select" :class="{ open: measureDropdownOpen }" @focusout="closeMeasureDropdown">
                      <button
                        type="button"
                        class="settings-select-trigger"
                        @click="measureDropdownOpen = !measureDropdownOpen"
                        aria-haspopup="listbox"
                        :aria-expanded="measureDropdownOpen"
                      >
                        <span>{{ measureSystemLabel }}</span>
                        <i class="bi bi-chevron-down"></i>
                      </button>
                      <div v-if="measureDropdownOpen" class="settings-select-menu" role="listbox">
                        <button
                          v-for="option in measureOptions"
                          :key="option.value"
                          type="button"
                          class="settings-select-option"
                          :class="{ selected: measureSystem === option.value, choosing: choosingMeasure === option.value }"
                          @mousedown.prevent="selectMeasureSystem(option.value)"
                          role="option"
                          :aria-selected="measureSystem === option.value"
                        >
                          {{ option.label }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'notifications'">
              <h3 class="fw-bold mb-4 d-flex align-items-center gap-2">
                <i class="bi bi-bell text-primary-custom"></i> Notification Settings
              </h3>
              <div class="list-group list-group-flush">
                <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3">
                  <div>
                    <h6 class="fw-bold mb-1">Recipe of the Day Notification</h6>
                    <p class="text-muted small mb-0">Receive a daily notification featuring our cooking recommendation.</p>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input switch-custom" type="checkbox" role="switch" v-model="notifyDaily" @change="saveGeneralSettings">
                  </div>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center bg-transparent border-bottom px-0 py-3">
                  <div>
                    <h6 class="fw-bold mb-1">Newsletter & Updates</h6>
                    <p class="text-muted small mb-0">Receive emails about new features, articles and recipes.</p>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input switch-custom" type="checkbox" role="switch" v-model="notifyNews" @change="saveGeneralSettings">
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { auth, firestore } from '../firebase'
import {
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { clearUserLocalData, deleteUserData, getUserProfile, saveUserProfile } from '../services/api'
import LayeredLoader from './LayeredLoader.vue'

defineProps({
  isDarkMode: Boolean
})

const emit = defineEmits(['toggle-theme'])

const router = useRouter()
const activeTab = ref('account')
const currentUser = ref(null)
const userProfile = ref({})
const nickname = ref('')
const savedNickname = ref('')
const previewPhoto = ref(null)
const photoBase64 = ref(null)
const savedPhotoBase64 = ref(null)
const fileInputRef = ref(null)
const profileSaving = ref(false)
const profileMessage = ref('')
const profileError = ref('')

// Dietary State
const vegetarian = ref(false)
const vegan = ref(false)
const glutenFree = ref(false)
const dairyFree = ref(false)
const saveMessage = ref('')

// General preferences State (stored locally)
const measureSystem = ref('metric')
const notifyDaily = ref(true)
const notifyNews = ref(false)
const passwordLoading = ref(false)
const deleteLoading = ref(false)
const measureDropdownOpen = ref(false)
const choosingMeasure = ref('')
const measureOptions = [
  { value: 'metric', label: 'Metric (g, ml, C)' },
  { value: 'us', label: 'Imperial (oz, cup, F)' }
]
const measureSystemLabel = computed(() => measureOptions.find(option => option.value === measureSystem.value)?.label || measureOptions[0].label)
const hasProfileChanges = computed(() => {
  return nickname.value.trim() !== savedNickname.value.trim() || photoBase64.value !== savedPhotoBase64.value
})

const applyProfileFields = (profile = {}) => {
  nickname.value = profile.nickname || ''
  savedNickname.value = profile.nickname || ''
  previewPhoto.value = profile.photoBase64 || null
  photoBase64.value = profile.photoBase64 || null
  savedPhotoBase64.value = profile.photoBase64 || null
}

const loadPreferences = async (uid) => {
  try {
    const profileKey = `profile_${uid}`
    const local = localStorage.getItem(profileKey)
    if (local) {
      const parsed = JSON.parse(local)
      userProfile.value = parsed
      applyProfileFields(parsed)
      if (parsed.dietPreferences) {
        vegetarian.value = !!parsed.dietPreferences.vegetarian
        vegan.value = !!parsed.dietPreferences.vegan
        glutenFree.value = !!parsed.dietPreferences.glutenFree
        dairyFree.value = !!parsed.dietPreferences.dairyFree
      }
    }

    const profile = await getUserProfile(uid)
    if (profile) {
      userProfile.value = {
        ...userProfile.value,
        ...profile
      }
      applyProfileFields(userProfile.value)
      if (profile.dietPreferences) {
        vegetarian.value = !!profile.dietPreferences.vegetarian
        vegan.value = !!profile.dietPreferences.vegan
        glutenFree.value = !!profile.dietPreferences.glutenFree
        dairyFree.value = !!profile.dietPreferences.dairyFree
      }
      localStorage.setItem(profileKey, JSON.stringify(userProfile.value))
    }
  } catch (err) {
    console.error("Error loading preferences:", err)
  }
}

const savePreferences = async () => {
  if (!currentUser.value) return
  try {
    const data = {
      dietPreferences: {
        vegetarian: vegetarian.value,
        vegan: vegan.value,
        glutenFree: glutenFree.value,
        dairyFree: dairyFree.value
      }
    }
    
    // Sync to local storage
    const profileKey = `profile_${currentUser.value.uid}`
    const existing = localStorage.getItem(profileKey)
    const profile = existing ? JSON.parse(existing) : {}
    profile.dietPreferences = data.dietPreferences
    localStorage.setItem(profileKey, JSON.stringify(profile))
    userProfile.value = profile

    // Sync to Firestore
    const userDocRef = doc(firestore, 'users', currentUser.value.uid)
    await setDoc(userDocRef, data, { merge: true })

    saveMessage.value = 'Dietary preferences saved!'
    setTimeout(() => { saveMessage.value = '' }, 2500)
  } catch (err) {
    console.error("Error saving preferences:", err)
  }
}

const saveGeneralSettings = () => {
  try {
    const key = currentUser.value ? `settings_${currentUser.value.uid}` : 'settings_guest'
    const settings = {
      measureSystem: measureSystem.value,
      notifyDaily: notifyDaily.value,
      notifyNews: notifyNews.value
    }
    localStorage.setItem(key, JSON.stringify(settings))
  } catch (e) {
    console.error(e)
  }
}

const loadGeneralSettings = () => {
  try {
    const key = currentUser.value ? `settings_${currentUser.value.uid}` : 'settings_guest'
    const settingsStr = localStorage.getItem(key)
    if (settingsStr) {
      const parsed = JSON.parse(settingsStr)
      measureSystem.value = parsed.measureSystem || 'metric'
      notifyDaily.value = parsed.notifyDaily !== false
      notifyNews.value = !!parsed.notifyNews
    }
  } catch (e) {
    console.error(e)
  }
}

const closeMeasureDropdown = () => {
  setTimeout(() => { measureDropdownOpen.value = false }, 120)
}

const selectMeasureSystem = (value) => {
  choosingMeasure.value = value
  setTimeout(() => {
    measureSystem.value = value
    saveGeneralSettings()
    measureDropdownOpen.value = false
    choosingMeasure.value = ''
  }, 120)
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const maxSize = 300
      let { width, height } = img

      if (width > height && width > maxSize) {
        height *= maxSize / width
        width = maxSize
      } else if (height > maxSize) {
        width *= maxSize / height
        height = maxSize
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      const base64 = canvas.toDataURL('image/jpeg', 0.7)
      previewPhoto.value = base64
      photoBase64.value = base64
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const saveProfile = async () => {
  if (!currentUser.value || !hasProfileChanges.value) return
  profileSaving.value = true
  profileMessage.value = ''
  profileError.value = ''

  try {
    const updatedProfile = {
      ...userProfile.value,
      nickname: nickname.value,
      photoBase64: photoBase64.value || null
    }
    await saveUserProfile(currentUser.value, updatedProfile)
    await updateProfile(currentUser.value, { displayName: nickname.value })
    userProfile.value = updatedProfile
    savedNickname.value = nickname.value
    savedPhotoBase64.value = photoBase64.value
    localStorage.setItem(`profile_${currentUser.value.uid}`, JSON.stringify(updatedProfile))
    window.dispatchEvent(new Event('profile-updated'))
    profileMessage.value = 'Profile saved successfully!'
    setTimeout(() => { profileMessage.value = '' }, 2500)
  } catch (err) {
    profileError.value = "Error while saving: " + err.message
  } finally {
    profileSaving.value = false
  }
}

const resetPassword = async () => {
  if (!currentUser.value) return
  passwordLoading.value = true
  try {
    await sendPasswordResetEmail(auth, currentUser.value.email)
    alert("Reset link sent! Please check your email inbox.")
  } catch (err) {
    alert("Failed to send reset email: " + err.message)
  } finally {
    passwordLoading.value = false
  }
}

const hasRecentLogin = (user) => {
  const lastSignIn = Date.parse(user?.metadata?.lastSignInTime || '')
  if (!lastSignIn) return true
  return Date.now() - lastSignIn < 4 * 60 * 1000
}

const reauthenticateForDeletion = async (user) => {
  if (hasRecentLogin(user)) return

  const providerIds = user.providerData.map((provider) => provider.providerId)
  if (providerIds.includes('google.com')) {
    await reauthenticateWithPopup(user, new GoogleAuthProvider())
    return
  }

  if (providerIds.includes('password') && user.email) {
    const password = prompt("For security reasons, please enter your password to delete your account.")
    if (!password) throw new Error('Account deletion canceled: password is required.')
    const credential = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, credential)
    return
  }

  throw new Error('Please log out, log in again, and then delete your account.')
}

const deleteAccount = async () => {
  if (!currentUser.value || deleteLoading.value) return
  if (!confirm("Are you absolutely sure you want to delete your CookITalia account? This action is permanent and cannot be reversed.")) return

  deleteLoading.value = true
  const user = currentUser.value
  const uid = user.uid

  try {
    // Re-autenticazione preventiva se l'utente non ha effettuato l'accesso di recente
    await reauthenticateForDeletion(user)

    // 1. CANCELLA PRIMA DA FIRESTORE (Le regole sono ancora attive e valide)
    await deleteUserData(uid)
    console.log("Dati Firestore e localStorage ripuliti con successo.")

    // 2. CANCELLA L'UTENTE DA FIREBASE AUTHENTICATION
    await deleteUser(user)
    console.log("Account rimosso definitivamente da Firebase Auth.")

    clearUserLocalData(uid)
    window.dispatchEvent(new Event('profile-updated'))
    await router.replace({ name: 'home' })
    await nextTick()
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  } catch (error) {
    console.error("Errore durante la rimozione totale dell'account:", error)
    if (error.code === 'auth/requires-recent-login') {
      alert("For security reasons, please log out, log in again, and then delete your account.")
    } else {
      alert("Failed to delete account: " + error.message)
    }
  } finally {
    deleteLoading.value = false
  }
}


onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (user) {
      await loadPreferences(user.uid)
      loadGeneralSettings()
    }
  })
})
</script>

<style scoped>
.settings-view { background-color: var(--color-background); }
.settings-header { padding-top: 1.5rem; }
.back-link { color: var(--color-primary-theme); }
.back-link:hover { color: var(--color-primary-theme-hover); }

.settings-sidebar-card, .settings-content-card {
  background-color: var(--color-navbar);
  border: 1px solid var(--color-border);
}

.sidebar-photo-wrap {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sidebar-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-photo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}
.profile-photo-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-photo-overlay-bg);
  color: var(--color-text-inverse);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.profile-photo-circle:hover .profile-photo-overlay {
  opacity: 1;
}
.disabled-email-input {
  background-color: var(--color-disabled-input-bg) !important;
  color: var(--color-text-secondary) !important;
  border-color: var(--color-border) !important;
  cursor: not-allowed;
}

.settings-menu .list-group-item {
  color: var(--color-text-primary);
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.settings-menu .list-group-item:hover {
  background-color: var(--color-primary-theme);
  color: var(--color-white-logo);
}
.settings-menu .list-group-item.active {
  background-color: var(--color-primary-theme);
  color: var(--color-white-logo);
}

.btn-outline-primary-custom {
  color: var(--color-primary-theme);
  border-color: var(--color-primary-theme);
  background-color: var(--color-white-logo);
  transition: all 0.2s;
}
.btn-outline-primary-custom:hover {
  background-color: var(--color-primary-theme);
  border-color: var(--color-primary-theme);
  color: var(--color-white-logo);
}
.btn-outline-primary-custom:disabled {
  opacity: 0.5;
}
.btn-reset-password-custom {
  background-color: var(--color-primary-theme) !important;
  border: 1px solid var(--color-primary-theme) !important;
  color: var(--color-text-inverse) !important;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}
.btn-reset-password-custom:hover,
.btn-reset-password-custom:focus {
  background-color: var(--color-primary-theme-hover) !important;
  border-color: var(--color-primary-theme-hover) !important;
  color: var(--color-text-inverse) !important;
}
.btn-reset-password-custom:active,
.btn-reset-password-custom:active:focus {
  background-color: var(--color-primary-theme) !important;
  border-color: var(--color-primary-theme) !important;
  color: var(--color-text-inverse) !important;
  box-shadow: none;
  transform: none;
}
.btn-danger-custom {
  background-color: var(--color-red);
  border: 1px solid var(--color-red);
  color: var(--color-text-inverse);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}
.btn-danger-custom:hover,
.btn-danger-custom:focus {
  background-color: var(--color-red-hover);
  border-color: var(--color-red-hover);
  color: var(--color-text-inverse);
}
.btn-danger-custom:active,
.btn-danger-custom:active:focus {
  background-color: var(--color-red);
  border-color: var(--color-red);
  color: var(--color-text-inverse);
  box-shadow: none;
  transform: none;
}

.switch-custom {
  background-color: var(--color-disabled-bg);
  border-color: var(--color-disabled-bg);
}
.switch-custom:checked {
  background-color: var(--color-primary-theme);
  border-color: var(--color-primary-theme);
}
.switch-custom:focus {
  box-shadow: none;
  border-color: var(--color-border);
}
.switch-custom:not(:checked) {
  background-color: var(--color-disabled-bg);
  border-color: var(--color-disabled-bg);
}

/* ==========================================================================
   TENDINA MISURE (ZONA FIX LIGHT/DARK MODE)
   ========================================================================== */
.settings-select {
  position: relative;
  width: min(260px, 100%);
}
.settings-select-trigger {
  width: 100%;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.45rem 0.9rem 0.45rem 1rem;
  background-color: var(--color-navbar);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 22px;
  font: inherit;
  text-align: left;
  transition: border-radius 0.12s ease, box-shadow 0.12s ease;
}
.settings-select-trigger span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.settings-select-trigger i {
  flex: 0 0 auto;
}
.settings-select-trigger:focus {
  outline: none;
  box-shadow: none;
}
.settings-select.open .settings-select-trigger {
  border-color: var(--color-border);
  border-bottom-color: transparent;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0 -4px 12px rgba(32, 33, 36, 0.06), -4px 0 12px rgba(32, 33, 36, 0.06), 4px 0 12px rgba(32, 33, 36, 0.06);
}
.settings-select-menu {
  position: absolute;
  top: calc(100% - 1px);
  left: 0;
  right: 0;
  z-index: 20;
  overflow: hidden;
  background-color: var(--color-navbar);
  border: 1px solid var(--color-border);
  border-top: 0;
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  box-shadow: 0 8px 12px rgba(32, 33, 36, 0.1);
}
.settings-select-option {
  width: 100%;
  padding: 0.65rem 1rem;
  border: 0;
  background: transparent;
  color: var(--color-text-primary);
  font: inherit;
  text-align: left;
}
.settings-select-option:hover {
  background-color: var(--color-primary-theme);
  color: var(--color-text-inverse);
}
.settings-select-option.choosing {
  background-color: var(--color-primary-theme);
  color: var(--color-text-inverse);
}
</style>

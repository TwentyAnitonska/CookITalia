import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './firebase' // Inizializza Firebase

// Import CSS e Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 1. Crea l'istanza dell'app
const app = createApp(App)

// 2. Aggiungi il router
app.use(router)

// 3. Monta l'app (UNICA VOLTA)
app.mount('#app')

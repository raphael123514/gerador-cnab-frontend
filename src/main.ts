import './assets/main.css'
import './assets/styles/containers.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import 'vue-good-table-next/dist/vue-good-table-next.css'

import App from './App.vue'
import PhosphorIcons from "@phosphor-icons/vue"
import router from './router'
import * as Maska from 'maska'

const app = createApp(App)

app.use(PhosphorIcons)
// Registra a diretiva 'v-maska' explicitamente para evitar problemas de importação
app.directive('maska', Maska.vMaska)
app.use(createPinia())
app.use(router)

app.mount('#app')

axios.defaults.baseURL = '/api'
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        localStorage.clear()
        // Redireciona para login se não autorizado
        window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

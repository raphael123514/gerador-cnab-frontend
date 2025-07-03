import './assets/main.css'
import './assets/styles/containers.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import '@vuepic/vue-datepicker/dist/main.css';

import App from './App.vue'
import PhosphorIcons from "@phosphor-icons/vue"
import router from './router'

const app = createApp(App)

app.use(PhosphorIcons)
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

import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
    role: 'admin' | 'user' | [string | null]
}

interface LoginCredentials {
    email: string;
    password: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('auth_token') || null,
        user: JSON.parse(localStorage.getItem('user') || '{}') as User,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role.includes('admin'),
    },

    actions: {
        async login(credentials: LoginCredentials) {
            try {
                const response = await axios.post('/login', credentials)

                const token = response.data.token || response.data.data?.token
                const user = response.data.user || response.data.data?.user

                if (token && user) {
                    this.token = token
                    this.user = user
                    localStorage.setItem('auth_token', token)
                    localStorage.setItem('user', JSON.stringify(user))
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

                    return true 
                } else {
                    throw new Error('Token ou dados do usuário não encontrados na resposta.')
                }
            } catch (error) {
                console.error('Erro no login:', error)
                throw error
            }
        },

        logout() {
            // 1. Limpa o estado reativo do Pinia
            this.token = null
            this.user = { role: [null] } as User

            // 2. Remove os dados persistidos do localStorage
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')

            // 3. Remove o cabeçalho de autorização padrão do Axios
            delete axios.defaults.headers.common['Authorization']
        }
    }
})
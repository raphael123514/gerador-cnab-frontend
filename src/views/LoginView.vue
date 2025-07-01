<template>
    <div :class="styles['login-container']">
        <div :class="styles['login-card']">
            <h1 :class="styles['login-title']">Bem-vindo</h1>
            <form @submit.prevent="login">
                <BaseInput label="Email" id="email" type="email" v-model="email" required />
                <BaseInput label="Senha" id="password" type="password" v-model="password" required />
                <BaseButton type="submit">Entrar</BaseButton>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import styles from '@/assets/styles/login.module.css'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const email = ref('')
const password = ref('')
const router = useRouter()

function login() {
    axios.post('/login', {
        email: email.value,
        password: password.value
    })
        .then(response => {
            const token = response.data.token || response.data.data?.token
            if (token) {
                localStorage.setItem('auth_token', token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                router.push('/')
            } else {
                console.error('Token não encontrado na resposta do servidor')
            }
        })
        .catch(error => {
            alert('Erro no login: ' + (error.response?.data?.message || error.message))
        })
}
</script>

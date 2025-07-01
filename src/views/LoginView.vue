<template>
    <div :class="styles['login-container']">
        <div :class="styles['login-card']">
            <h1 :class="styles['login-title']">Bem-vindo</h1>
            <form @submit.prevent="login">
                <BaseInput label="Email" id="email" type="email" v-model="email" required />
                <BaseInput label="Senha" id="password" type="password" v-model="password" required />
                <BaseButton type="submit" :disabled="loading">
                    {{ loading ? 'Entrando...' : 'Entrar' }}
                </BaseButton>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import styles from '@/assets/styles/login.module.css';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { useAuthStore } from '@/stores/auth';

interface ApiErrorPayload {
    message: string;
}

const email = ref<string>('');
const password = ref<string>('');
const loading = ref(false);
const router = useRouter();
const authStore = useAuthStore();

async function login() {
    loading.value = true;
    try {
        await authStore.login({ email: email.value, password: password.value });
        router.push('/');
    } catch (error) {
        let errorMessage = 'Ocorreu um erro desconhecido durante o login.';
        if (isAxiosError<ApiErrorPayload>(error)) {
            errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        alert('Erro no login: ' + errorMessage);
    } finally {
        loading.value = false;
    }
}
</script>

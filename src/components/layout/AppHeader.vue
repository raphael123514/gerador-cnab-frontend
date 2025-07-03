<template>
    <header class="app-header">
        <div class="header-content">
            <div class="user-info">
                <span>Olá, {{ authStore.user?.name || 'Usuário' }}</span>
            </div>
            <button @click="logout" class="logout-button" title="Sair">
                <IconLogout class="logout-icon" />
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import IconLogout from '@/components/icons/IconLogout.vue'

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
    try {
        await authStore.logout()
        router.push('/login')
    } catch (error) {
        console.error('Falha ao realizar o logout:', error)
    }
}
</script>

<style scoped>
.app-header {
    background-color: #1f1f23;
    padding: 0.20rem 1.5rem;
    border-bottom: 1px solid #27272a;
    color: #a1a1aa;
}

.header-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
}

.logout-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #a1a1aa;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s, color 0.2s;
}

.logout-button:hover {
    background-color: #3f3f46;
    color: #f4f4f5;
}

.logout-icon {
    width: 1.5rem;
    height: 1.5rem;
}
</style>
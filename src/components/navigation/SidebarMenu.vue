<template>
    <nav :class="styles.sidebar">
        <div :class="styles['sidebar-header']">
            <span :class="styles['sidebar-title']">Sistema Gerador CNAB</span>
        </div>
        <ul :class="styles['sidebar-menu']">
            <li v-if="authStore.isAdmin">
                <RouterLink :to="'/user'" v-slot="{ isActive }">
                    <span :class="[styles['sidebar-link'], isActive && styles['sidebar-link-active']]"
                        style="text-decoration: none !important; box-shadow: none !important;">
                        <IconAddUser style="margin-right: 8px; vertical-align: middle;" />
                        Criar Usuario
                    </span>
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import styles from './SidebarMenu.module.css'
import { useAuthStore } from '@/stores/auth'
import IconAddUser from '../icons/IconAddUser.vue'

const authStore = useAuthStore()
</script>

<style scoped></style>

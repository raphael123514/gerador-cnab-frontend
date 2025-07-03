<template>
    <nav :class="styles.sidebar">
        <div :class="styles['sidebar-header']">
            <span :class="styles['sidebar-title']">Sistema Gerador CNAB</span>
        </div>
        <ul :class="styles['sidebar-menu']">
            <li>
                <RouterLink :to="'/cnab'" v-slot="{ isActive }">
                    <span :class="[styles['sidebar-link'], isActive && styles['sidebar-link-active']]"
                        style="text-decoration: none !important; box-shadow: none !important;">
                        <PhBank :size="24" weight="bold" style="margin-right: 8px; vertical-align: middle;"/>
                        CNAB
                    </span>
                </RouterLink>
            </li>
            <li v-if="authStore.isAdmin">
                <RouterLink :to="'/user'" v-slot="{ isActive }">
                    <span :class="[styles['sidebar-link'], isActive && styles['sidebar-link-active']]"
                        style="text-decoration: none !important; box-shadow: none !important;">
                        <IconUsers style="margin-right: 8px; vertical-align: middle;" />
                        Usuários
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
import IconUsers from '../icons/IconUsers.vue'

const authStore = useAuthStore()
</script>

<style scoped></style>

<template>
    <div class="home-layout">
        <SidebarMenu />
        <div class="main-container">
            <AppHeader />
            <AppContent>
                <router-view />
            </AppContent>
        </div>
    </div>
</template>

<script setup lang="ts">
import SidebarMenu from '@/components/navigation/SidebarMenu.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppContent from '@/components/AppContent.vue'
</script>

<style scoped>
.home-layout {
    display: flex;
    min-height: 100vh;
    background: #18181b;
}

.main-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
</style>

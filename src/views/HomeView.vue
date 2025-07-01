<template>
    <div class="home-layout">
        <SidebarMenu />
        <AppContent>
            <router-view />
        </AppContent>
    </div>
</template>

<script setup lang="ts">
import SidebarMenu from '@/components/navigation/SidebarMenu.vue'
import AppContent from '@/components/AppContent.vue'
</script>

<style scoped>
.home-layout {
    display: flex;
    min-height: 100vh;
    background: #18181b;
}
</style>

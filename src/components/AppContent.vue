<template>
    <main class="main-content">
        <slot />
    </main>
</template>

<script setup lang="ts">
// Slot para conteúdo principal da aplicação
</script>

<style scoped>
.main-content {
    flex: 1;
    background: #18181b;
    min-height: 100vh;
    padding: 1rem 2rem;
    color: #fff;
    overflow-y: auto;
}
</style>

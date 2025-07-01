<template>
    <h2 :class="['base-title', $attrs.class]">
        <slot />
    </h2>
</template>

<script setup lang="ts">
// Componente base para títulos de seção/página
</script>

<style scoped>
.base-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #fff;
}
</style>

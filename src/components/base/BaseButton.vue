<template>
    <button :type="type" class="login-btn" v-bind="$attrs">
        <slot />
    </button>
</template>

<script setup lang="ts">
defineProps<{
    type?: 'button' | 'submit' | 'reset'
}>()
</script>

<style scoped>
.login-btn {
    width: 100%;
    padding: 0.75rem 0;
    border: none;
    border-radius: 0.75rem;
    background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.login-btn:hover {
    background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
    transform: translateY(-2px) scale(1.03);
}
</style>

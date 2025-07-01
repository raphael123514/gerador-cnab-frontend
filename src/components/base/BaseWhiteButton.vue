<template>
    <button :disabled="disabled" class="base-white-btn" @click="$emit('click')" type="button" :title="tooltip">
        <slot />
    </button>
</template>

<script setup lang="ts">
defineProps<{
    disabled?: boolean,
    tooltip?: string
}>()
defineEmits(['click'])
</script>

<style scoped>
.base-white-btn {
    background: #fff;
    color: #23232b;
    border: none;
    border-radius: 0.7rem;
    padding: 0.5rem 1.5rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.07);
    margin-left: 1rem;
}

.base-white-btn:disabled {
    background: #e5e7eb;
    color: #a1a1aa;
    cursor: not-allowed;
    box-shadow: none;
}
</style>
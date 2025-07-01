<template>
    <div v-if="open" :class="$style.overlay">
        <div :class="$style.modal">
            <div :class="$style.header">
                <slot name="header">
                    <h2>{{ title }}</h2>
                </slot>
                <button :class="$style.close" @click="$emit('close')">&times;</button>
            </div>
            <div :class="$style.body">
                <slot />
            </div>
            <div :class="$style.footer">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    open: boolean
    title?: string
}>()
defineEmits(['close'])
</script>

<style module>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: #23272f;
    padding: 2.5rem 2rem;
    border-radius: 1.5rem;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    min-width: 350px;
    color: #fff;
    min-height: 100px;
    max-width: 95vw;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.close {
    background: none;
    border: none;
    color: #fff;
    font-size: 2rem;
    cursor: pointer;
    margin-left: 1rem;
}

.body {
    margin-bottom: 1.5rem;
}

.footer {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}
</style>

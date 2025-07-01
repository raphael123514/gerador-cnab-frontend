<template>
    <div class="input-group">
        <label :for="id" class="input-label">{{ label }}</label>
        <input :id="id" :type="type" v-model="modelValueProxy" v-bind="$attrs" class="input" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    label: string
    id: string
    type?: string
    modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])

const modelValueProxy = computed({
    get: () => props.modelValue,
    set: (val: string) => emit('update:modelValue', val)
})
</script>

<style scoped>
.input-group {
    width: 100%;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
}

.input-label {
    color: #b5b5b5;
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.input {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    border: none;
    background: #b2b2b3;
    color: #fff;
    font-size: 1rem;
    outline: none;
    transition: box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.input:focus {
    box-shadow: 0 0 0 2px #6366f1;
}
</style>

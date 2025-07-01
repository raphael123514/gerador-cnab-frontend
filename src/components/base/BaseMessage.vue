<template>
    <div v-if="visible" :class="[
        $style.message,
        type === 'success' ? $style.success : $style.error
    ]" role="alert">
        <slot>
            {{ message }}
        </slot>
        <button :class="$style.close" @click="close">&times;</button>
        <ul v-if="type === 'error' && errors && Object.keys(errors).length" :class="$style.errorList">
            <li v-for="(msgs, field) in errors" :key="field">
                <strong>{{ field }}:</strong>
                <span v-for="(msg, idx) in msgs" :key="idx">{{ msg }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
    type: 'success' | 'error'
    message?: string
    errors?: Record<string, string[]>
    duration?: number // ms, opcional para auto-close
}>()

const emit = defineEmits(['close'])

const visible = ref(true)

function close() {
    visible.value = false
    emit('close')
}

if (props.duration && props.duration > 0) {
    setTimeout(close, props.duration)
}

watch(() => props.message, () => {
    visible.value = true
})
</script>

<style module>
.message {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
    padding: 1rem 1.5rem 1rem 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    font-size: 1rem;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    min-width: 250px;
    max-width: 100%;
    word-break: break-word;
    animation: fadeIn 0.2s;
}

.success {
    background: #1e3a1e;
    color: #a7f3d0;
    border: 1px solid #22c55e;
}

.error {
    background: #3a1e1e;
    color: #fecaca;
    border: 1px solid #ef4444;
}

.close {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
}

.errorList {
    margin: 0.5rem 0 0 0;
    padding: 0 0 0 1rem;
    color: #fecaca;
    font-size: 0.95em;
    list-style: disc;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

<template>
    <div class="upload-group">
        <label v-if="label" :for="id" class="upload-label">{{ label }}</label>
        <label :for="id" :class="['drop-zone', { 'is-active': isDragActive }]" @dragenter.prevent="isDragActive = true"
            @dragover.prevent="isDragActive = true" @dragleave.prevent="isDragActive = false" @drop.prevent="handleDrop">
            <input :id="id" type="file" @change="handleFileChange" accept=".xlsx" class="drop-zone-input" />

            <div v-if="!modelValue" class="drop-zone-prompt">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                    class="feather feather-upload-cloud">
                    <path d="M16 16l-4-4-4 4M12 12v9" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    <path d="M16 16l-4-4-4 4" />
                </svg>
                <span>Arraste e solte o arquivo aqui, ou <strong>clique para selecionar</strong></span>
                <small>Apenas arquivos .xlsx</small>
            </div>

            <div v-else class="file-info">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="feather feather-file-text">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
                <span class="file-name">{{ modelValue.name }}</span>
                <button @click.prevent="clearFile" class="clear-button" title="Remover arquivo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                        class="feather feather-x">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </label>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps<{
    id: string;
    label?: string;
    modelValue: File | null;
}>();

const emit = defineEmits(['update:modelValue']);

const errorMessage = ref<string | null>(null);
const isDragActive = ref(false);

const validateAndEmit = (file: File | null) => {
    errorMessage.value = null;
    if (!file) {
        emit('update:modelValue', null);
        return;
    }

    if (file.name.endsWith('.xlsx')) {
        emit('update:modelValue', file);
    } else {
        errorMessage.value = 'Formato inválido. Apenas arquivos .xlsx são permitidos.';
        // Limpa o valor do input se a validação falhar
        const input = document.getElementById(props.id) as HTMLInputElement;
        if (input) input.value = '';
    }
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] || null;
    validateAndEmit(file);
};

const handleDrop = (event: DragEvent) => {
    isDragActive.value = false;
    const file = event.dataTransfer?.files?.[0] || null;
    validateAndEmit(file);
};

const clearFile = () => {
    emit('update:modelValue', null);
};
</script>

<style scoped>
.upload-group { width: 100%; }
.upload-label { display: block; margin-bottom: 0.5rem; color: #b5b5b5; font-size: 1rem; }
.drop-zone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px dashed #374151;
    border-radius: 0.75rem;
    padding: 1.5rem;
    min-height: 140px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    background-color: #1f2937;
}
.drop-zone.is-active { border-color: #6366f1; background-color: #2b3649; }
.drop-zone-input { display: none; }
.drop-zone-prompt { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; color: #9ca3af; }
.drop-zone-prompt svg { color: #6b7280; }
.drop-zone-prompt strong { color: #6366f1; }
.drop-zone-prompt small { font-size: 0.8rem; }
.file-info { display: flex; align-items: center; gap: 1rem; color: #e5e7eb; }
.file-info svg { color: #6366f1; flex-shrink: 0; }
.file-name { font-weight: 500; text-align: left; word-break: break-all; }
.clear-button { background: #4b5563; border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #e5e7eb; cursor: pointer; transition: all 0.2s; margin-left: auto; }
.clear-button:hover { background: #ef4444; color: white; transform: scale(1.1); }
.error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    text-align: left;
}
</style>
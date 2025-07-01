<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="id" :class="labelClass">{{ label }}</label>
    <multiselect :id="id" v-model="modelValueProxy" :options="options" :searchable="true" :close-on-select="true"
      :clear-on-select="false" :preserve-search="true" :placeholder="placeholder || 'Selecione...'" :label="'label'"
      :track-by="'value'" :required="required" :class="selectClass" :allow-empty="!required" :show-labels="false" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const props = defineProps<{
  id: string
  label?: string
  modelValue: string | number
  options: { label: string; value: string | number }[]
  required?: boolean
  placeholder?: string
  wrapperClass?: string
  labelClass?: string
  selectClass?: string
}>()
const emit = defineEmits(['update:modelValue'])

const modelValueProxy = computed({
  get: () => props.options.find(o => o.value === props.modelValue) || null,
  set: v => emit('update:modelValue', v ? v.value : '')
})
</script>

<style scoped>
:deep(.multiselect),
:deep(.multiselect__tags),
:deep(.multiselect__input),
:deep(.multiselect__single) {
  background: #18181b !important;
  color: #fff !important;
  border-radius: 0.75rem !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  font-size: 1rem;
  height: 48px !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  padding: 0 !important;
}

:deep(.multiselect__tags) {
  padding: 0 !important;
  min-height: 0 !important;
  height: 48px !important;
  box-shadow: none !important;
}

:deep(.multiselect__input),
:deep(.multiselect__single) {
  min-height: 48px !important;
  height: 48px !important;
  padding: 0.75rem 1rem !important;
  box-shadow: none !important;
}

:deep(.multiselect__content-wrapper) {
  background: #131318 !important;
  color: #e5e7eb !important;
  border-radius: 0.75rem !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
  max-height: 220px !important;
  min-width: 220px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  scrollbar-color: #6366f1 #23232b;
  scrollbar-width: thin;
  z-index: 9999 !important;
}

:deep(.multiselect__content-wrapper::-webkit-scrollbar) {
  width: 8px;
  background: #23232b;
}

:deep(.multiselect__content-wrapper::-webkit-scrollbar-thumb) {
  background: #6366f1;
  border-radius: 8px;
}

:deep(.multiselect__option--highlight) {
  background: #6366f1 !important;
  color: #fff !important;
}

:deep(.multiselect__option) {
  background: #131318 !important;
  color: #e5e7eb !important;
}

:deep(.multiselect:focus-within .multiselect__tags) {
  box-shadow: 0 0 0 2px #6366f1 !important;
}

:deep(.multiselect__placeholder) {
  color: #b5b5b5 !important;
  opacity: 1 !important;
}

:deep(.multiselect__select) {
  background: transparent !important;
  color: #fff !important;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #b5b5b5;
  font-size: 1rem;
}
</style>

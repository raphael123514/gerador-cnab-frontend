<template>
  <div :class="wrapperClass">
    <label v-if="label" :for="id" :class="labelClass">{{ label }}</label>
    <select
      :id="id"
      v-model="modelValueProxy"
      :required="required"
      :class="selectClass"
    >
      <option value="" disabled selected hidden>Selecione...</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  id: string
  label?: string
  modelValue: string | number
  options: { label: string; value: string | number }[]
  required?: boolean
  wrapperClass?: string
  labelClass?: string
  selectClass?: string
}>()
const emit = defineEmits(['update:modelValue'])

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<style scoped>
select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #33354d;
  background: #b2b2b3;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
select:focus {
  border-color: #6366f1;
}
label {
  display: block;
  margin-bottom: 0.4rem;
  color: #b5b5b5;
  font-size: 0.97rem;
}
</style>

<template>
    <BaseModal :open="props.open" title="Novo Usuário" @close="close">
        <form @submit.prevent="handleSubmit">
            <div class="form-grid">
                <BaseInput id="name" v-model="form.name" label="Nome" type="text" placeholder="Digite o nome do usuário"
                    />

                <BaseInput id="email" v-model="form.email" label="Email" type="email" placeholder="Digite o e-mail do usuário"
                    />

                <BaseInput id="password" v-model="form.password" label="Senha" type="password" placeholder="Digite a senha"
                    />

                <BaseSelect id="role" v-model="form.role" label="Perfil" :options="userRoles"
                    />
            </div>
        </form>
        <template #footer>
            <BaseButton type="button" @click="close">Cancelar</BaseButton>
            <BaseButton type="submit" @click="handleSubmit">Salvar</BaseButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { reactive, defineEmits, defineProps } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseSelect from '@/components/base/BaseSelect.vue';

interface UserForm {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
}
interface SelectOption {
    value: 'admin' | 'user';
    label: string;
}

const emit = defineEmits(['close', 'save'])

const props = defineProps({
    open: {
        type: Boolean,
        required: true
    },
})

const form = reactive<UserForm>({
    name: '', email: '', password: '', role: 'user'
})
const resetForm = () => {
    form.name = ''
    form.email = ''
    form.password = ''
    form.role = 'user'
}

const userRoles: SelectOption[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'Usuário' },
]

function handleSubmit() {
    emit('save', { ...form })
    resetForm()
}

function close() {
    emit('close')
    resetForm()
}
</script>
<style scoped>
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}
</style>

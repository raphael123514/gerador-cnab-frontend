<template>
    <div :class="style['header-content']">
        <BaseTitle>Criar Usuário</BaseTitle>
    </div>

    <BaseMessage v-if="showSuccess" type="success" message="Usuário cadastrado com sucesso!" :duration="5000"
        @close="showSuccess = false" />

    <BaseMessage v-if="showError" type="error" :message="apiErrorMessage" :errors="apiErrors" :duration="5000"
        @close="showError = false" />

    <div :class="[style.container, 'form-container']">
        <form @submit.prevent="handleSubmit">
            <div class="form-grid">
                <BaseInput id="name" v-model="form.name" label="Nome" type="text" placeholder="Digite o nome do usuário"
                    :error="apiErrors.name?.[0]" />

                <BaseInput id="email" v-model="form.email" label="Email" type="email" placeholder="Digite o e-mail do usuário"
                    :error="apiErrors.email?.[0]" />

                <BaseInput id="password" v-model="form.password" label="Senha" type="password" placeholder="Digite a senha"
                    :error="apiErrors.password?.[0]" />

                <BaseSelect id="role" v-model="form.role" label="Tipo" :options="userRoles" :error="apiErrors.role?.[0]" />
            </div>

            <div class="form-actions">
                <BaseButton type="submit" class="btn-salvar">
                    Salvar
                </BaseButton>
            </div>
        </form>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import style from '@/layouts/ContentPage.module.css'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTitle from '@/components/base/BaseTitle.vue'
import BaseMessage from '@/components/base/BaseMessage.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import { translateApiErrors } from '@/utils/translateErrors';
import axios, { isAxiosError } from 'axios';

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

interface ApiValidationPayload {
    message: string;
    errors: Record<string, string[]>;
}

const showSuccess = ref(false)
const showError = ref(false)
const apiErrorMessage = ref('')
const apiErrors = ref<Record<string, string[]>>({})

const form = reactive<UserForm>({
    name: '',
    email: '',
    password: '',
    role: 'admin',
})

const userRoles: SelectOption[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'Comum' },
]

const resetForm = () => {
    form.name = '';
    form.email = '';
    form.password = '';
    form.role = 'admin';
}

const handleSubmit = async () => {
    const token = localStorage.getItem('auth_token');
    apiErrors.value = {};
    showError.value = false;
    try {
        await axios.post('/admin/users', form, { headers: { Authorization: `Bearer ${token}` } });
        showSuccess.value = true;
        resetForm();
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        showError.value = true;
        apiErrorMessage.value = 'Erro ao salvar usuário. Verifique os campos obrigatórios.';
        if (isAxiosError<ApiValidationPayload>(error) && error.response?.data?.errors) {
            apiErrors.value = translateApiErrors(error.response.data.errors);
        }
    }
}
</script>

<style scoped>

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

.form-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
}

.btn-salvar {
    font-size: 0.95rem;
    padding: 0.6rem 1.5rem;
}

.form-container :deep(label) {
    color: #1a1a1a;
}
</style>
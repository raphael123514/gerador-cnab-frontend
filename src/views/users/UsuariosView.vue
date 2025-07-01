<template>
    <div :class="style['header-content']">
        <BaseTitle>Usuários</BaseTitle>
        <BaseButton type="button" @click="openModal = true" class="btn-novo-usuario">
            <IconAddUser style="margin-right: 6px; vertical-align: middle;" /> Novo Usuario
        </BaseButton>
    </div>

    <BaseMessage v-if="showSuccess" type="success" message="Usuário cadastrado com sucesso!" :duration="5000"
        @close="showSuccess = false" />

    <BaseMessage v-if="showError" type="error" :message="apiErrorMessage" :errors="apiErrors" :duration="5000"
        @close="showError = false" />

    <div :class="style['container-entitys']">
        <vue-good-table :columns="columns" :rows="users" :pagination-options="paginationOptions" :total-rows="totalItems"
            :current-page="page" :per-page="perPage" :search-options="{ enabled: false }" :loading="loading"
            v-on:page-change="onPageChange" v-on:per-page-change="onPerPageChange" />
    </div>
    <UsuariosModal :open="openModal" @close="openModal = false" @save="handleSave" />
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { VueGoodTable } from 'vue-good-table-next'
import style from '@/layouts/ContentPage.module.css'
import { translateApiErrors } from '@/utils/translateErrors';
import axios, { isAxiosError } from 'axios';

import UsuariosModal from './UsuariosModal.vue';
import BaseTitle from '@/components/base/BaseTitle.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import IconAddUser from '@/components/icons/IconAddUser.vue';


interface ApiValidationPayload {
    message: string;
    errors: Record<string, string[]>;
}

const openModal = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const apiErrorMessage = ref('')
const apiErrors = ref<Record<string, string[]>>({})

const users = ref<{ name: string; email: string; role: 'admin' | 'user' }[]>([])
const loading = ref(false)
const page = ref(1)
const perPage = ref(10)
const totalItems = ref(0)

const columns = [
    {
        label: 'Nome',
        field: 'name',
        sortable: true
    },
    {
        label: 'E-mail',
        field: 'email',
        sortable: true
    },
    {
        label: 'Perfil',
        field: 'role',
        sortable: true,
        formatFn: (value: 'admin' | 'user') => {
            if (value === 'admin') return 'Admin';
            if (value === 'user') return 'Usuário';
            return value;
        }
    },
]

const paginationOptions = computed(() => ({
    enabled: true,
    mode: 'pages',
    perPage: perPage.value,
    perPageDropdown: [5, 10, 20, 50],
    dropdownAllowAll: false,
    server: true,
    nextLabel: 'Próximo',
    prevLabel: 'Anterior',
    rowsPerPageLabel: 'Linhas por página',
    ofLabel: 'de',
    pageLabel: 'página',
    allLabel: 'Todos'
}))

function fetchUsers() {
    loading.value = true
    const token = localStorage.getItem('auth_token')

    axios.get('/admin/users', {
        params: { page: page.value, per_page: perPage.value },
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => {
            users.value = Array.isArray(response.data.data)
                ? response.data.data.map((v: any) => ({
                    name: String(v?.name || ''),
                    email: String(v?.email || ''),
                    role: String(v?.role || '')
                }))
                : []
            totalItems.value = response.data.meta?.total || 0
        })
        .catch(error => {
            console.error('Erro ao buscar usuarios:', error)
            users.value = []
            totalItems.value = 0
        })
        .finally(() => {
            loading.value = false
        })
}

function onPageChange(params: { currentPage: number }) {
    page.value = params.currentPage
}

function onPerPageChange(params: { currentPerPage: number }) {
    perPage.value = params.currentPerPage
    page.value = 1
}

watch([page, perPage], fetchUsers)
onMounted(() => {
    fetchUsers()
})

const handleSave = async (data: { name: string; email: string; password: string; role: 'admin' | 'user' }) => {
    const token = localStorage.getItem('auth_token');
    apiErrors.value = {};
    showError.value = false;
    try {
        await axios.post('/admin/users', data, { headers: { Authorization: `Bearer ${token}` } });
        showSuccess.value = true;
        openModal.value = false
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        showError.value = true;
        openModal.value = false
        apiErrorMessage.value = 'Erro ao salvar usuário. Verifique os campos obrigatórios.';
        if (isAxiosError<ApiValidationPayload>(error) && error.response?.data?.errors) {
            apiErrors.value = translateApiErrors(error.response.data.errors);
        }
    }
}
</script>
<style scoped>

.btn-novo-usuario {
    font-size: 0.95rem;
    padding: 0.4rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: fit-content;
}
</style>
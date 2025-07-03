<template>
    <div :class="style['header-content']">
        <BaseTitle>Importação de CNAB</BaseTitle>
    </div>

    <BaseMessage v-if="showSuccess" type="success" message="Operação realizada com sucesso!" :duration="5000"
        @close="showSuccess = false" />

    <BaseMessage v-if="showError" type="error" :message="apiErrorMessage" :errors="apiErrors" :duration="5000"
        @close="showError = false" />

    <div :class="style['container-entitys']">
        <form @submit.prevent="handleImport" class="import-container">
            <div class="container-inputs-row">
                <BaseFileUpload id="cnab-file" label="Upload de arquivo Excel (.xlsx)" v-model="importForm.file" />
                <BaseInput id="fund" label="Fundo" v-model="importForm.fund" placeholder="Digite o fundo" />
                <BaseInput id="file-sequence" label="Sequência do Arquivo" v-model="importForm.file_sequence"
                    placeholder="Digite a sequência" />

            </div>
            <BaseButton type="submit" class="btn-import">Importar</BaseButton>
            <div>

            </div>
        </form>

        <div class="filters-container">
            <div class="filter-inputs-row">
                <div class="input-group">
                    <label class="input-label">Selecione a Data</label>
                    <VueDatePicker class="custom-datepicker"  v-model="localFilters.created_at" range dark placeholder="dd/mm/yyyy - dd/mm/yyyy" format="dd/MM/yyyy" label="Data da solicitação" multi-calendars/>

                </div>
                <BaseSelect id="status-filter" label="Status" v-model="localFilters.state" :options="statusOptions" />
                <BaseButton @click="applyFilters">Filtrar</BaseButton>
                <BaseButton @click="clearFilters" class="btn-secondary">Limpar</BaseButton>
            </div>
        </div>
        <vue-good-table :columns="columns" :rows="cnabImports" :pagination-options="paginationOptions"
            :total-rows="totalRecords" :search-options="{ enabled: false }" :loading="loading" mode="remote"
            @on-page-change="onPageChange" @on-per-page-change="onPerPageChange" @on-sort-change="onSortChange" />
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';

import { VueGoodTable } from 'vue-good-table-next'
import style from '@/layouts/ContentPage.module.css';
import './CNABView.css';
import { translateApiErrors } from '@/utils/translateErrors';
import axios, { isAxiosError } from 'axios';

import BaseTitle from '@/components/base/BaseTitle.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseFileUpload from '@/components/base/BaseFileUpload.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseMessage from '@/components/base/BaseMessage.vue';
import moment from 'moment';


interface ApiValidationPayload {
    message: string;
    errors: Record<string, string[]>;
}

interface SortObject {
    field: string;
    type: 'asc' | 'desc';
}

interface CnabImport {
    id: number | string;
    file_name: string;
    created_at: string;
    state: 'pending' | 'processing' | 'completed' | 'error';
    user: {
        name: string;
    };
}

const showSuccess = ref(false)
const showError = ref(false)
const apiErrorMessage = ref('')
const apiErrors = ref<Record<string, string[]>>({})

const importForm = ref({
    file: null as File | null,
    fund: '',
    file_sequence: '',
});

const localFilters = ref({
    created_at: '',
    state: '',
});

const cnabImports = ref<CnabImport[]>([])
const loading = ref(false)
const totalRecords = ref(0)

// Centraliza os parâmetros para a requisição ao servidor
const serverParams = ref({
    page: 1,
    per_page: 10,
    sort: [] as SortObject[],
    filters: {} as Record<string, any>
})

const columns = [
    {
        label: 'Nome do arquivo importado',
        field: 'file_name',
        sortable: true
    },
    {
        label: 'Data da solicitação',
        field: 'created_at',
        sortable: true
    },
    {
        label: 'Status',
        field: 'state',
        sortable: true,
    },
    {
        label: 'Usuário solicitante',
        field: 'user.name',
        sortable: true
    },
    {
        label: 'Ações',
        field: 'actions',
        sortable: false,
    },
]

const statusOptions = [
    { label: 'Pendente', value: 'pending' },
    { label: 'Processando', value: 'processing' },
    { label: 'Concluído', value: 'completed' },
    { label: 'Erro', value: 'error' }
];

const paginationOptions = computed(() => ({
    enabled: true,
    mode: 'pages',
    perPageDropdown: [5, 10, 20, 50],
    dropdownAllowAll: false,
    nextLabel: 'Próximo',
    prevLabel: 'Anterior',
    rowsPerPageLabel: 'Linhas por página',
    ofLabel: 'de',
    pageLabel: 'página',
    allLabel: 'Todos'
}))

function fetchCnabImports(params = serverParams.value) {
    loading.value = true
    const token = localStorage.getItem('auth_token')

    axios.get('/admin/cnab-imports', {
        params: params,
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => {
            cnabImports.value = response.data.data || []
            totalRecords.value = response.data.meta?.total || 0
        })
        .catch(error => {
            console.error('Erro ao buscar importações de CNAB:', error)
            cnabImports.value = []
            totalRecords.value = 0
        })
        .finally(() => {
            loading.value = false
        })
}

const updateParams = (newProps: Partial<typeof serverParams.value>) => {
    serverParams.value = { ...serverParams.value, ...newProps };
};

const onPageChange = (params: { currentPage: number }) => {
    updateParams({ page: params.currentPage });
    fetchCnabImports();
};

const onPerPageChange = (params: { currentPerPage: number }) => {
    updateParams({ per_page: params.currentPerPage, page: 1 });
    fetchCnabImports();
};

const onSortChange = (params: SortObject[]) => {
    updateParams({ sort: params });
    fetchCnabImports();
};

async function handleImport() {
    if (!importForm.value.file) {
        apiErrorMessage.value = 'Por favor, selecione um arquivo para importar.';
        showError.value = true;
        return;
    }

    const formData = new FormData();
    formData.append('file', importForm.value.file);
    formData.append('fund', importForm.value.fund);
    formData.append('file_sequence', importForm.value.file_sequence);

    loading.value = true;
    const token = localStorage.getItem('auth_token');

    try {
        await axios.post('/admin/cnab-imports', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        showSuccess.value = true;
        importForm.value = { file: null, fund: '', file_sequence: '' };
        fetchCnabImports();
    } catch (error) {
        console.error('Erro ao importar arquivo:', error);
        apiErrors.value = {};
        showError.value = true;

        if (isAxiosError<ApiValidationPayload>(error) && error.response?.data?.errors) {
            apiErrorMessage.value = error.response.data.message || 'Por favor, corrija os erros abaixo.';
            apiErrors.value = translateApiErrors(error.response.data.errors);
        } else {
            apiErrorMessage.value = 'Ocorreu um erro ao importar o arquivo.';
        }
    } finally {
        loading.value = false;
    }
}

function applyFilters() {
    const newFilters: Record<string, any> = {};

    if (localFilters.value.created_at) {
        const dateRangeString = localFilters.value.created_at;
        const [startDateStr, endDateStr] = dateRangeString.split(' - ');

        const startDate = moment(startDateStr, 'DD/MM/YYYY', true);
        const endDate = moment(endDateStr, 'DD/MM/YYYY', true);

        if (startDate.isValid() && endDate.isValid()) {
            newFilters.created_at_start = startDate.format('YYYY-MM-DD');
            newFilters.created_at_end = endDate.format('YYYY-MM-DD');
        }
    }

    if (localFilters.value.state) {
        newFilters.state = localFilters.value.state;
    }

    updateParams({ filters: newFilters, page: 1 });
    fetchCnabImports();
}

function clearFilters() {
    localFilters.value.created_at = '';
    localFilters.value.state = '';
    applyFilters();
}

onMounted(fetchCnabImports);
</script>
<style lang="css" scoped>
:deep(.vgt-table) {
    border-radius: 0px 0px 0 0 !important;
}
:deep(.filter-inputs-row .input-group) {
    margin-bottom: 0;
}
</style>
<template>
    <div :class="style['header-content']">
        <BaseTitle>Importação de CNAB</BaseTitle>
    </div>

    <BaseMessage v-if="showSuccess" type="success" message="Operação realizada com sucesso!" :duration="5000"
        @close="showSuccess = false" />

    <BaseMessage v-if="showError" type="error" :message="apiErrorMessage" :errors="apiErrors" :duration="5000"
        @close="showError = false" />

    <div :class="style['container-entitys']">
        <form @submit.prevent="handleImport" class="import-container" v-if="authStore.isAdmin">
            <div class="container-inputs-row">
                <BaseFileUpload id="cnab-file" label="Upload de arquivo Excel (.xlsx)" v-model="importForm.file_upload" />
                <BaseSelect id="fund" label="Fundo" v-model="importForm.fund_id" :options="fundOptions"  class="input-group"/>
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
            :per-page="perPage"
            v-on:page-change="onPageChange" v-on:per-page-change="onPerPageChange" v-on:sort-change="onSortChange">
            <template #table-row="props">
                <span v-if="props.column.field == 'actions'" class="actions-container">
                    <button @click="downloadFile(props.row.id, props.row.original_filename, 'excel')" class="action-button" title="Baixar Excel">
                        <PhFileXls :size="24" weight="bold" />
                    </button>
                    <button @click="downloadFile(props.row.id, props.row.original_filename, 'cnab')" class="action-button" title="Baixar CNAB">
                        <PhFileTxt :size="24" weight="bold" />
                    </button>
                </span>
            </template>
        </vue-good-table>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios, { isAxiosError } from 'axios';
import moment from 'moment';

import VueDatePicker from '@vuepic/vue-datepicker'
import { VueGoodTable } from 'vue-good-table-next'
import { PhFileXls, PhFileTxt } from '@phosphor-icons/vue'

import style from '@/layouts/ContentPage.module.css'
import './CNABView.css'

import { translateApiErrors } from '@/utils/translateErrors'

import BaseTitle from '@/components/base/BaseTitle.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseFileUpload from '@/components/base/BaseFileUpload.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseMessage from '@/components/base/BaseMessage.vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()


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
const perPage = ref(10)
const fundOptions = ref<{ label: string; value: number | string }[]>([]);

const importForm = ref({
    file_upload: null as File | null,
    fund_id: '',
    file_sequence: '',
});

const localFilters = ref({
    created_at: null as Date[] | null,
    state: '',
});

const cnabImports = ref<CnabImport[]>([])
const loading = ref(false)
const totalRecords = ref(0)

const serverParams = ref({
    page: 1,
    per_page: 10,
    sort: [] as SortObject[],
    filters: {} as Record<string, any>
})

const columns = [
    {
        label: 'Nome do arquivo importado',
        field: 'original_filename',
        sortable: true
    },
    {
        label: 'Data da solicitação',
        field: 'created_at',
        sortable: true,
        formatFn: (value: string) => {
            return value ? moment(value).format('DD/MM/YYYY H:mm:ss') : '';
        }
    },
    {
        label: 'Status',
        field: 'status',
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
        tdClass: 'actions-cell'
    },
]

const statusOptions = [
    { label: 'Pendente', value: 'pendente' },
    { label: 'Processando', value: 'processando' },
    { label: 'Concluído', value: 'concluido' },
    { label: 'Erro', value: 'erro' }
];

const paginationOptions = computed(() => ({
    enabled: true,
    mode: 'pages',
    perPage: perPage.value,
    perPageDropdown: [5, 10, 20, 50],
    dropdownAllowAll: false,
    nextLabel: 'Próximo',
    prevLabel: 'Anterior',
    rowsPerPageLabel: 'Linhas por página',
    ofLabel: 'de',
    pageLabel: 'página',
    allLabel: 'Todos'
}))

async function fetchFunds() {
    const token = localStorage.getItem('auth_token');
    try {
        const response = await axios.get('/funds', {
            headers: { Authorization: `Bearer ${token}` }
        });

        fundOptions.value = response.data.data.map((fund: { id: number; name: string }) => ({
            value: fund.id,
            label: fund.name,
        }));
    } catch (error) {
        console.error('Erro ao buscar a lista de fundos:', error);
        apiErrorMessage.value = 'Não foi possível carregar a lista de fundos.';
        showError.value = true;
    }
}

function fetchCnabImports(params = serverParams.value) {
    loading.value = true
    const token = localStorage.getItem('auth_token')

    axios.get('/cnab', {
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

const onPageChange = (params: { currentPage: number; }) => {
    updateParams({ page: params.currentPage });
    fetchCnabImports();
};

const onPerPageChange = (params: { currentPerPage: number; }) => {
    updateParams({ per_page: params.currentPerPage, page: 1 });
    fetchCnabImports();
};

const onSortChange = (params: SortObject[]) => {
    updateParams({ sort: params });
    fetchCnabImports();
};

async function handleImport() {
    if (!importForm.value.file_upload) {
        apiErrorMessage.value = 'Por favor, selecione um arquivo para importar.';
        showError.value = true;
        return;
    }

    const formData = new FormData();
    formData.append('file_upload', importForm.value.file_upload);
    formData.append('fund_id', importForm.value.fund_id);
    formData.append('file_sequence', importForm.value.file_sequence);

    loading.value = true;
    const token = localStorage.getItem('auth_token');

    try {
        await axios.post('/admin/cnab/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        showSuccess.value = true;
        importForm.value = { file_upload: null, fund_id: '', file_sequence: '' };
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

async function downloadFile(processingId: number | string, fileName: string, type: string) {
    const token = localStorage.getItem('auth_token');
    try {
        const response = await axios.get(`/cnab/${processingId}/download/${type}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
        });

        let downloadFilename = fileName;

        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition && type == "cnab") {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
            if (filenameMatch && filenameMatch.length > 1) {
                downloadFilename = filenameMatch[1];
            }
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadFilename);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro ao fazer download do arquivo:', error);
        apiErrorMessage.value = 'Não foi possível fazer o download do arquivo.';
        showError.value = true;
    }
}

function applyFilters() {
    const newFilters: Record<string, any> = {};
    const dateRange = localFilters.value.created_at;

    if (Array.isArray(dateRange) && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
        const startDate = moment(dateRange[0]);
        const endDate = moment(dateRange[1]);

        if (startDate.isValid() && endDate.isValid()) {
            newFilters.date_from = startDate.format('YYYY-MM-DD');
            newFilters.date_to = endDate.format('YYYY-MM-DD');
        }
    }

    if (localFilters.value.state) {
        newFilters.status = localFilters.value.state;
    }

    updateParams({ filters: newFilters, page: 1 });
    fetchCnabImports();
}

function clearFilters() {
    localFilters.value.created_at = null;
    localFilters.value.state = '';
    applyFilters();
}

onMounted(() => {
    fetchCnabImports();
    fetchFunds();
});
</script>
<style lang="css" scoped>
:deep(.vgt-table) {
    border-radius: 0px 0px 0 0 !important;
}
:deep(.filter-inputs-row .input-group) {
    margin-bottom: 0;
}

:deep(.actions-cell) {
    text-align: center;
    vertical-align: middle;
}

</style>
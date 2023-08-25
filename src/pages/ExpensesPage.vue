<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="q-gutter-md row justify-between items-center">
          <div class="text-h6">Despesas</div>
          <q-btn label="Nova Despesa" @click="showDialog = true" />
        </div>
      </q-card-section>
      <q-card-section>
        <!-- ... seu código anterior para a tabela ... -->
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <q-table
          :rows="expenses"
          row-key="id"
          :columns="columns"
          :rows-per-page-options="[10, 25, 50]"
          v-model:pagination="pagination"
        >
          <template v-slot:body-cell-edit="props">
            <q-td :props="props">
              <div class="q-gutter-xs q-table__control q-ml-auto">
                <q-btn
                  flat
                  round
                  icon="remove_red_eye"
                  @click="viewExpense(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="edit"
                  @click="startEditing(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="delete"
                  @click="confirmDelete(props.row)"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-description="props">
            <q-td :props="props">
              <q-input
                v-if="editingId === props.row.id"
                v-model="editedFields.description"
                @keyup.enter="updateExpense(props.row)"
              />
              <template v-else>
                {{ props.row.description }}
              </template>
            </q-td>
          </template>
          <template v-slot:body-cell-value="props">
            <q-td :props="props">
              <q-input
                v-if="editingId === props.row.id"
                v-model="editedFields.value"
                @keyup.enter="updateExpense(props.row)"
              />
              <template v-else>
                {{ props.row.value }}
              </template>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Diálogo Modal para adicionar nova despesa -->
    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Adicionar Nova Despesa</div>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            v-model="newExpense.description"
            label="Descrição"
            class="q-mt-md"
          />
          <q-input outlined v-model="newExpense.value" label="Valor" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showDialog = false" />
          <q-btn flat label="Adicionar" @click="addExpense" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section>
          <div>Tem certeza de que deseja excluir este registro?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" @click="showDeleteDialog = false" />
          <q-btn label="Confirmar" @click="deleteExpense" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ExpensesPage',
  setup() {
    const expenses = ref([]);
    const pagination = ref({ page: 1, rowsPerPage: 10 });
    const editingId = ref(null);
    const editedFields = ref({ description: '', value: '' });

    const columns = [
      {
        name: 'description',
        label: 'Description',
        align: 'left',
        field: 'description',
      },
      { name: 'value', label: 'Value', align: 'left', field: 'value' },
      { name: 'user_id', label: 'User ID', align: 'left', field: 'user_id' },
      {
        name: 'created_at',
        label: 'Created At',
        align: 'left',
        field: (row) => new Date(row.created_at).toLocaleString(),
      },
      { name: 'edit', label: '', align: 'left', field: 'edit' },
    ];

    const fetchExpenses = async () => {
      const token = window.localStorage.getItem('auth_token');
      const apiUrl = getApiUrl();

      try {
        const response = await axios.get(`${apiUrl}/expenses/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        expenses.value = response.data.data;
      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
      }
    };

    const router = useRouter();

    const viewExpense = (row) => {
      router.push({ name: 'ExpenseDetails', params: { id: row.id } });
    };

    const startEditing = (row) => {
      editingId.value = row.id;
      editedFields.value.description = row.description;
      editedFields.value.value = row.value;
    };

    const updateExpense = async (row) => {
      const apiUrl = getApiUrl();
      const token = window.localStorage.getItem('auth_token');

      const cleanedValue = editedFields.value.value
        .replace('R$ ', '')
        .replace(',00', '');

      const requestBody = {
        value: cleanedValue,
        description: editedFields.value.description,
      };

      try {
        await axios.put(`${apiUrl}/expenses/${row.id}`, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchExpenses();
        editingId.value = null;
      } catch (error) {
        console.error('Erro ao atualizar despesa:', error);
      }
    };

    const showDialog = ref(false);
    const newExpense = ref({ value: '', description: '' });

    const addExpense = async () => {
      const apiUrl = getApiUrl();
      const token = window.localStorage.getItem('auth_token');

      const requestBody = {
        value: newExpense.value.value,
        description: newExpense.value.description,
      };

      try {
        await axios.post(`${apiUrl}/expenses`, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showDialog.value = false;
        fetchExpenses(); // atualiza a lista de despesas
        newExpense.value = { value: '', description: '' };
      } catch (error) {
        console.error('Erro ao adicionar nova despesa:', error);
      }
    };

    const showDeleteDialog = ref(false);
    const rowToDelete = ref(null);

    const confirmDelete = (row) => {
      showDeleteDialog.value = true;
      rowToDelete.value = row;
    };

    const deleteExpense = async () => {
      const apiUrl = getApiUrl();
      const token = window.localStorage.getItem('auth_token');

      try {
        await axios.delete(`${apiUrl}/expenses/${rowToDelete.value.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchExpenses();
      } catch (error) {
        console.error('Erro ao excluir despesa:', error);
      }

      showDeleteDialog.value = false;
    };

    fetchExpenses();

    return {
      expenses,
      columns,
      pagination,
      startEditing,
      updateExpense,
      editingId,
      editedFields,
      viewExpense,
      showDialog,
      newExpense,
      addExpense,
      showDeleteDialog,
      confirmDelete,
      deleteExpense,
    };
  },
});
</script>

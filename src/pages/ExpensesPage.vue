<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Expenses</div>
      </q-card-section>
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
              <q-btn flat round icon="edit" @click="startEditing(props.row)" />
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
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';

export default defineComponent({
  name: 'ExpensesPage',
  setup() {
    const expenses = ref([]);
    const pagination = ref({ page: 1, rowsPerPage: 10 });
    const editingId = ref(null);
    const editedFields = ref({ description: '', value: '' });

    const columns = [
      { name: 'edit', label: '', align: 'left', field: 'edit' },
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

    const startEditing = (row) => {
      editingId.value = row.id;
      editedFields.value.description = row.description;
      editedFields.value.value = row.value;
    };

    const updateExpense = async (row) => {
      const apiUrl = getApiUrl();
      const token = window.localStorage.getItem('auth_token');

      // Remove 'R$ ' e ',00' do campo "value"
      const cleanedValue = editedFields.value.value
        .replace('R$ ', '')
        .replace(',00', '');

      // Preparando o corpo da requisição com apenas os campos "value" e "description"
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

    fetchExpenses();

    return {
      expenses,
      columns,
      pagination,
      startEditing,
      updateExpense,
      editingId,
      editedFields,
    };
  },
});
</script>

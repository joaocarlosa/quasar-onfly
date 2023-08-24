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
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';

export default defineComponent({
  name: 'ExpensesPage',
  setup() {
    const expenses = ref([]);
    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
    });

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

    onMounted(fetchExpenses);

    return {
      expenses,
      columns,
      pagination,
    };
  },
});
</script>

<style scoped>
/* Seus estilos aqui */
</style>

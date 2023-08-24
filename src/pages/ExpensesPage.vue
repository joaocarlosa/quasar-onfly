<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Expenses</div>
      </q-card-section>
      <q-card-section>
        <div v-for="expense in expenses" :key="expense.id">
          <q-item>
            <q-item-section>
              {{ expense.description }} - {{ expense.value }} (ID:
              {{ expense.user_id }})
            </q-item-section>
            <q-item-section side>
              {{ new Date(expense.created_at).toLocaleString() }}
            </q-item-section>
          </q-item>
        </div>
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
    };
  },
});
</script>

<style scoped>
/* Seus estilos aqui */
</style>

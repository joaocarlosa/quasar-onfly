<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Detalhes da Despesa</div>
      </q-card-section>
      <q-card-section>
        <p><strong>ID:</strong> {{ expense.id }}</p>
        <p><strong>Descrição:</strong> {{ expense.description }}</p>
        <p><strong>Valor:</strong> {{ expense.value }}</p>
        <p><strong>ID do Usuário:</strong> {{ expense.user_id }}</p>
        <p>
          <strong>Criado em:</strong>
          {{ new Date(expense.created_at).toLocaleString() }}
        </p>
        <p>
          <strong>Atualizado em:</strong>
          {{ new Date(expense.updated_at).toLocaleString() }}
        </p>
      </q-card-section>
      <q-card-section>
        <q-btn label="Voltar" @click="goBack" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const expense = ref({});
    const router = useRouter();
    const id = router.currentRoute.value.params.id;
    const token = window.localStorage.getItem('auth_token');
    const apiUrl = getApiUrl();

    const fetchExpense = async () => {
      try {
        const response = await axios.get(`${apiUrl}/expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        expense.value = response.data.data;
      } catch (error) {}
    };

    const goBack = () => {
      router.back();
    };

    fetchExpense();

    return {
      expense,
      goBack,
    };
  },
});
</script>

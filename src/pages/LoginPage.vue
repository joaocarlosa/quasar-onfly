<template>
  <q-page class="q-pa-md row justify-center items-center" style="height: 100vh">
    <div>
      <q-input outlined v-model="email" label="Email" type="email"></q-input>
      <q-input
        outlined
        v-model="password"
        label="Password"
        type="password"
      ></q-input>
      <q-btn @click="login()" label="Login"></q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { getApiUrl } from '../config/apiConfig'; // atualize o caminho conforme necessário

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const email = ref('jc2@email.com');
    const password = ref('123123');

    async function login() {
      const payload = {
        email: email.value,
        password: password.value,
      };

      const apiUrl = getApiUrl();
      try {
        const response = await axios.post(`${apiUrl}/login`, payload);
        console.log('Resposta da API:', response.data);
      } catch (error) {
        console.error('Erro ao fazer login:', error);
      }
    }

    return {
      email,
      password,
      login,
    };
  },
});
</script>

<style scoped>
/* Seus estilos CSS aqui */
</style>

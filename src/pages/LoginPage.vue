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
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const email = ref('jc@email.com');
    const password = ref('123123');
    const router = useRouter();

    async function login() {
      const payload = {
        email: email.value,
        password: password.value,
      };

      const apiUrl = getApiUrl();
      try {
        const response = await axios.post(`${apiUrl}/login`, payload);

        if (response.data && response.data.token) {
          window.localStorage.setItem('auth_token', response.data.token);
          router.push({ name: 'expenses' });
        }
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

<style scoped></style>

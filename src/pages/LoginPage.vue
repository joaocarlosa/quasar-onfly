<template>
  <q-page class="q-pa-md row justify-center items-center" style="height: 100vh">
    <div>
      <div class="q-gutter-md row justify-between items-center">
        <div class="text-h6">Login</div>
      </div>
      <q-input outlined v-model="email" label="Email" type="email"></q-input>
      <q-input
        outlined
        v-model="password"
        label="Password"
        type="password"
      ></q-input>
      <q-btn @click="login()" label="Login"></q-btn>
      <q-btn
        @click="showCreateUserDialog = true"
        label="Cadastrar usuário"
      ></q-btn>
      <!-- Botão para abrir modal -->
      <q-dialog v-model="showCreateUserDialog">
        <q-card>
          <q-card-section>
            <q-input
              outlined
              v-model="newUser.name"
              label="Nome"
              type="text"
            ></q-input>
            <q-input
              outlined
              v-model="newUser.email"
              label="Email"
              type="email"
            ></q-input>
            <q-input
              outlined
              v-model="newUser.password"
              label="Senha"
              type="password"
            ></q-input>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cancelar" @click="showCreateUserDialog = false" />
            <q-btn label="Criar" @click="createUser" />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const newUser = ref({ name: '', email: '', password: '' });
    const showCreateUserDialog = ref(false);

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

    async function createUser() {
      const apiUrl = getApiUrl();
      const payload = {
        name: newUser.value.name,
        email: newUser.value.email,
        password: newUser.value.password,
      };

      try {
        const response = await axios.post(`${apiUrl}/users`, payload);

        if (response.data) {
          showCreateUserDialog.value = false;
        }
      } catch (error) {
        console.error('Erro ao criar novo usuário:', error);
      }
    }

    return {
      email,
      password,
      login,
      showCreateUserDialog,
      newUser,
      createUser,
    };
  },
});
</script>

<style scoped></style>

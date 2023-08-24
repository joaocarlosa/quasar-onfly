// src/router/routes.ts
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' }, // Redirecionar para /login
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      // outras rotas
    ],
  },
];

export default routes;

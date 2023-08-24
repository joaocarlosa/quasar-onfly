// src/router/routes.ts
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      {
        path: '/expenses',
        name: 'expenses',
        component: () => import('pages/ExpensesPage.vue'),
      },
    ],
  },
];

export default routes;

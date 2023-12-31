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
      {
        path: '/expenses/:id',
        name: 'ExpenseDetails',
        component: () => import('pages/ExpenseDetail.vue'),
      },
    ],
  },
];

export default routes;

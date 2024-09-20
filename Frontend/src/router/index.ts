import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('/@/pages/Index.vue'),
  },
  {
    path: '/1',
    component: () => import('/@/components/HelloWorld.vue'),
  },
  {
    path: '/taiwan',
    component: () => import('/@/pages/taiwan.vue'),
  },
  {
    path: '/test',
    component: () => import('/@/pages/test.vue'),
  }
];

export const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(),
  routes,
});

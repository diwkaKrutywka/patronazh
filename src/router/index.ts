import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// Основные маршруты
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "AdminView",
    component: () => import("../views/MainView.vue"),
    redirect: "/children/all",
    children: [
   
      {
        path: "children/all",
        name: "UserList",
        component: () => import("../views/kid/KidsList.vue"),
      },
      {
        path: "pregnancy/all",
        name: "PregnancyList",
        component: () => import("../views/pregnancy/PregnancyList.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "LoginView",
    component: () => import("../views/LoginView.vue"),
    children: [],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

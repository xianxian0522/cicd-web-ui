import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: '/middle',
  },
  {
    path: "/middle",
    name: "middle",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Middle.vue"),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/cicd',
    component: () => import('../components/Layout.vue'),
    children: [
      {
        path: 'biz', component: () => import('../components/BizLayout.vue'),
        children: [
          { path: '', name: 'biz', component: () => import('../views/Biz.vue') }
        ],
      },
      {
        path: ':bizId/', component: () => import('../components/AppLayout.vue'),
        children: [
          {path: 'project-list/:appId', name: 'project',
            component: () => import('../views/ProjectList.vue')},
          {path: 'version-list/:appId', name: 'version',
            component: () => import('../views/VersionList.vue')},
        ],
      },
      // {
      //   path: ':bizId/project-list/:appId',
      //   name: 'project',
      //   component: () => import('../views/ProjectList.vue')
      // },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

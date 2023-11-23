import personnelManagement from '@/views/personnel-management/index.vue';
import slideAndBanner from '@/views/slider-and-banner/index.vue';
import LocalStorageService from '@/utils/local-storage-service';
import transactionReport from '@/views/transaction-report.vue';
import userManagement from '@/views/user-management/index.vue';
import userMostPurchase from '@/views/user-most-purchase.vue';
import { createRouter, createWebHistory } from 'vue-router';
import accountSetting from '@/views/account-setting.vue';
import sendMessage from '@/views/send-message/index.vue';
import listSurvey from '@/views/list-survey/index.vue';
import manageRole from '@/views/Manage-role/index.vue';
import categories from '@/views/categories/index.vue';
import listOrder from '@/views/list-order/index.vue';
import storeReport from '@/views/store-report.vue';
import salesReport from '@/views/sales-report.vue';
import comments from '@/views/comments/index.vue';
import defaultLayout from '@/layout/default.vue';
import notFound from '@/views/not-found.vue';
import tags from '@/views/tags/index.vue';
import home from '@/views/home/index.vue';
import login from '@/views/login.vue';
//////////////////////////////
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'defaultLayout',
      component: defaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: home
        },
        {
          path: '/account-setting',
          name: 'accountSetting',
          component: accountSetting,
        },
        {
          path: '/comments',
          name: 'comments',
          component: comments,
        },
        {
          path: '/categories',
          name: 'categories',
          component: categories,
        },
        {
          path: '/listOrder',
          name: 'listOrder',
          component: listOrder,
        },
        {
          path: '/userMostPurchase',
          name: 'userMostPurchase',
          component: userMostPurchase,
        },
        {
          path: '/salesReport',
          name: 'salesReport',
          component: salesReport,
        },
        {
          path: '/storeReport',
          name: 'storeReport',
          component: storeReport,
        },
        {
          path: '/transactionReport',
          name: 'transactionReport',
          component: transactionReport,
        },
        {
          path: '/listSurvey',
          name: 'listSurvey',
          component: listSurvey,
        },
        {
          path: '/sendMessage',
          name: 'sendMessage',
          component: sendMessage,
        },
        {
          path: '/tags',
          name: 'tags',
          component: tags,
        },
        {
          path: '/slideAndBanner',
          name: 'slideAndBanner',
          component: slideAndBanner,
        },
        {
          path: '/personnelManagement',
          name: 'personnelManagement',
          component: personnelManagement,
        },
        {
          path: '/manageRole',
          name: 'manageRole',
          component: manageRole,
        },
        {
          path: '/userManagement',
          name: 'userManagement',
          component: userManagement,
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },

    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: notFound
    }
  ]
})
//////////////////////////
router.beforeEach((to, from, next) => {
  const isAuthenticated = LocalStorageService.getToken();
  ///////////////////////////////////
  if (to.name === 'login' && isAuthenticated) {
    next({ path: '/' })
  } else if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})
//////////////////////////
export default router

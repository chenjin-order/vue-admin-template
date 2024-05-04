import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import HomeLayout from '@/homelayout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/signup',
    component: () => import('@/views/signup/index'),
    hidden: true
  },
  {
    path: '/personal',
    component: () => import('@/views/personal/index')
  },
  // {
  //   path: '/settings',
  //   component: () => import('@/views/settings/index')
  // },
  {
    path: '/accountSettings',
    component: Layout,
    hidden: false,
    redirect: '/accountSettings/index',
    name: 'accountSettings',
    meta: {
      title: 'accountSettings',
      userRole: ['user']
    },
    children: [{
      path: 'index',
      name: 'index',
      component: () => import('@/views/settings/index'),
      meta: {
        title: '账号设置',
        icon: 'dashboard',
        userRole: ['user']
      }
    }]
  },
  {
    path: '/phoneSettings',
    component: Layout,
    hidden: false,
    redirect: '/phoneSettings/phone',
    name: 'phoneSettings',
    meta: {
      title: 'phoneSettings',
      userRole: ['user']
    },
    children: [{
      path: 'phone',
      name: 'phone',
      component: () => import('@/views/settings/phone'),
      meta: {
        title: '手机设置',
        icon: 'dashboard',
        userRole: ['user']
      }
    }]
  },
  {
    path: '/emailSettings',
    component: Layout,
    hidden: false,
    redirect: '/emailSettings/email',
    name: 'emailSettings',
    meta: {
      title: 'emailSettings',
      userRole: ['user']
    },
    children: [{
      path: 'email',
      name: 'email',
      component: () => import('@/views/settings/email'),
      meta: {
        title: '邮箱设置',
        icon: 'dashboard',
        userRole: ['user']
      }
    }]
  },
  {
    path: '/passwordSettings',
    component: Layout,
    hidden: false,
    redirect: '/passwordSettings/password',
    name: 'passwordSettings',
    meta: {
      title: 'passwordSettings',
      userRole: ['user']
    },
    children: [{
      path: 'password',
      name: 'password',
      component: () => import('@/views/settings/password'),
      meta: {
        title: '账号密码',
        icon: 'dashboard',
        userRole: ['user']
      }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/homepage',
    component: HomeLayout,
    hidden: false,
    redirect: '/homepage/index',
    name: 'homepage',
    meta: {
      title: 'homepage',
      userRole: ['user']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/homepage/index'),
        name: 'home',
        meta: {
          title: '首页',
          userRole: ['user']
        }
      }
    ]
  },
  {
    path: '/articlePage',
    component: HomeLayout,
    hidden: false,
    redirect: '/articlePage/index',
    name: 'articlePage',
    meta: {
      title: 'articlePage',
      userRole: ['user']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/articlePage/index'),
        name: 'article',
        meta: {
          title: '科普文章',
          userRole: ['user']
        }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/articlePage/detail'),
        hidden: true,
        name: 'articleDetail',
        meta: {
          title: '科普文章详情',
          userRole: ['user']
        }
      }
    ]
  },
  {
    path: '/eventPage',
    component: HomeLayout,
    hidden: false,
    redirect: '/eventPage/index',
    name: 'eventPage',
    meta: {
      title: 'eventPage',
      userRole: ['user']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/eventPage/index'),
        name: 'event',
        meta: {
          title: '灾害事件',
          userRole: ['user']
        }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/eventPage/detail'),
        hidden: true,
        name: 'eventDetail',
        meta: {
          title: '灾害事件详情',
          userRole: ['user']
        }
      }
    ]
  }

]

export const asyncRoutes = [
  // {
  //   path: '/homepage',
  //   component: HomeLayout,
  //   redirect: '/homepage/index',
  //   name: 'homepage',
  //   meta: {
  //     title: 'homepage',
  //     userRole: ['user']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/homepage/index'),
  //       name: 'home',
  //       meta: {
  //         title: '首页'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/articlePage',
  //   component: HomeLayout,
  //   hidden: false,
  //   redirect: '/articlePage/index',
  //   name: 'articlePage',
  //   meta: {
  //     title: 'articlePage',
  //     userRole: ['user']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/articlePage/index'),
  //       name: 'article',
  //       meta: {
  //         title: '科普文章'
  //       }
  //     },
  //     {
  //       path: 'detail/:id',
  //       component: () => import('@/views/articlePage/detail'),
  //       hidden: true,
  //       name: 'articleDetail',
  //       meta: {
  //         title: '科普文章详情'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/eventPage',
  //   component: HomeLayout,
  //   hidden: false,
  //   redirect: '/eventPage/index',
  //   name: 'eventPage',
  //   meta: {
  //     title: 'eventPage',
  //     userRole: ['user']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/eventPage/index'),
  //       name: 'event',
  //       meta: {
  //         title: '灾害事件'
  //       }
  //     },
  //     {
  //       path: 'detail/:id',
  //       component: () => import('@/views/eventPage/detail'),
  //       hidden: true,
  //       name: 'eventDetail',
  //       meta: {
  //         title: '灾害事件详情'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/responsePage',
  //   component: HomeLayout,
  //   redirect: '/responsePage/index',
  //   name: 'responsePage',
  //   meta: {
  //     title: 'responsePage',
  //     userRole: ['user']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/responsePage/index'),
  //       name: 'response',
  //       meta: {
  //         title: '应对措施'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    hidden: false,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '仪表盘',
        icon: 'dashboard',
        userRole: ['admin', 'editor']
      }
    }]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     userRole: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         userRole: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         userRole: ['editor', 'admin']
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'el-icon-s-help',
  //     userRole: ['admin', 'editor']
  //   },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },
  {
    path: '/users',
    component: Layout,
    hidden: false,
    redirect: '/users/list',
    name: 'Users',
    meta: {
      title: '用户管理',
      icon: 'el-icon-s-help',
      userRole: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/users/index'),
        meta: {
          title: '用户列表',
          icon: 'table',
          userRole: ['admin', 'editor']
        }
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/users/add'),
        meta: {
          title: '添加用户',
          icon: 'tree',
          userRole: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    hidden: false,
    redirect: '/article/articleList',
    name: 'Article',
    meta: {
      title: '文章管理',
      icon: 'el-icon-document',
      userRole: ['admin', 'editor']
    },
    children: [
      {
        path: 'articleList',
        name: 'articleList',
        component: () => import('@/views/article/index'),
        meta: {
          title: '文章列表',
          icon: 'el-icon-document-copy',
          userRole: ['admin', 'editor']
        }
      },
      {
        path: 'articleAdd',
        name: 'articleAdd',
        component: () => import('@/views/article/add'),
        meta: {
          title: '添加文章',
          icon: 'el-icon-document-add',
          userRole: ['admin', 'editor']
        }
      },
      {
        path: 'articleCategories',
        name: 'articleCategories',
        component: () => import('@/views/article/categories'),
        meta: {
          title: '文章类型',
          icon: 'tree',
          userRole: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/event',
    component: Layout,
    hidden: false,
    redirect: '/event/eventList',
    name: 'Event',
    meta: {
      title: '事件管理',
      icon: 'el-icon-c-scale-to-original',
      userRole: ['admin', 'editor']
    },
    children: [
      {
        path: 'eventList',
        name: 'eventList',
        component: () => import('@/views/event/index'),
        meta: {
          title: '事件列表',
          icon: 'el-icon-files',
          userRole: ['admin', 'editor']
        }
      },
      {
        path: 'eventAdd',
        name: 'eventAdd',
        component: () => import('@/views/event/add.vue'),
        meta: {
          title: '添加事件',
          icon: 'el-icon-circle-plus-outline',
          userRole: ['admin', 'editor']
        }
      },
      {
        path: 'eventTypes',
        name: 'eventTypes',
        component: () => import('@/views/event/types'),
        meta: {
          title: '事件类型',
          icon: 'tree',
          userRole: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/response',
    component: Layout,
    hidden: false,
    redirect: '/response/responseList',
    name: 'Response',
    meta: {
      title: '应对措施管理',
      icon: 'response',
      userRole: ['admin', 'editor']
    },
    children: [
      {
        path: 'responsesList',
        name: 'responsesList',
        component: () => import('@/views/response/index'),
        meta: {
          title: '应对措施列表',
          icon: 'list',
          userRole: ['admin', 'editor']
        }
      },
      {
        path: 'responseAdd',
        name: 'responseAdd',
        component: () => import('@/views/response/add.vue'),
        meta: {
          title: '添加应对措施',
          icon: 'el-icon-circle-plus-outline',
          userRole: ['admin', 'editor']
        }
      },
      {
        path: 'responseTypes',
        name: 'responseTypes',
        component: () => import('@/views/response/types'),
        meta: {
          title: '应对措施类型',
          icon: 'tree',
          userRole: ['admin', 'editor']
        }
      }
    ]
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: {
  //         title: 'Form',
  //         icon: 'form',
  //         userRole: ['admin', 'editor']
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested',
  //     userRole: ['admin', 'editor']
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  {
    path: 'external-link',
    component: Layout,
    hidden: false,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

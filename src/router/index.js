import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/prove',
    meta: { title: '证明管理', icon: 'component', roles: ['admin'] },
    component: Layout,
    children: [
      { path: 'prove_bak', name: 'prove', component: () => import('@/views/prove/prove_bak'), meta: { title: '证明设置', icon: 'dashboard' }},
      { path: 'sysvar', name: 'sysvar', component: () => import('@/views/prove/sysvar'), meta: { title: '参数定义', icon: 'dashboard' }},
      { path: 'sysconfig', name: 'sysconfig', component: () => import('@/views/prove/sysconfig'), meta: { title: '配置中心', icon: 'dashboard' }},
      { path: 'signet', name: 'signet', component: () => import('@/views/prove/signet'), meta: { title: '签章管理', icon: 'dashboard' }}]
  },
  {
    path: '/staffenquiry',
    meta: { title: '员工问询', icon: 'component', roles: ['admin'] },
    component: Layout,
    children: [
      { path: 'index', name: 'staffenquiry', component: () => import('@/views/staffenquiry/enquiry'), meta: { title: '员工问询', icon: 'dashboard' }},
      { path: 'tag', name: 'tag', component: () => import('@/views/staffenquiry/tag'), meta: { title: '标签管理', icon: 'dashboard' }}
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/prove'
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

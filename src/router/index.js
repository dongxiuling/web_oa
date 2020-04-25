import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/process',
    component: Layout,
    // redirect: 'index',
    meta: {
      title: '流程管理',
      icon: 'clipboard'
    },
    children: [
      {
        path: 'manage',
        component: () => import('@/views/process/manage'),
        meta: { title: '流程管理', icon: 'example' }
      },
      {
        path: 'temp',
        component: () => import('@/views/process/temp'),
        meta: { title: '流程模板', icon: 'exit-fullscreen' }
      },
      {
        path: 'index',
        component: () => import('@/views/process/link'),
        meta: { title: '环节管理', icon: 'link' }
      }
    ]
  },
  {
    path: '/exams',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'add',
        component: () => import('@/views/exam/add'),
        // name: '发布考试',
        meta: { title: '发布考试', icon: 'edit', noCache: true, affix: true },
        hidden: true
      },
      {
        path: 'detail',
        component: () => import('@/views/exam/addList/detail'),
        name: '我的发布详情',
        meta: { title: '我的发布详情', icon: 'build', noCache: true, affix: true },
        hidden: true
      },
      {
        path: 'single',
        component: () => import('@/views/exam/test/single'),
        // name: '单选题',
        meta: { title: '单选题', icon: 'monitor', noCache: true },
        hidden: true
      },
      {
        path: 'analytic',
        component: () => import('@/views/exam/test/analytic'),
        // name: '判断题',
        meta: { title: '考试结果', icon: 'monitor', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
  {
    path: '/meetings',
    component: Layout,
    hidden: true,
    children: [
      {
        path:'detail',
        component: () => import('@/views/meeting/addList/detail'),
        meta: { title: '会议详情', icon: 'monitor', noCache: true, affix: true },
        // hidden: true,
      }
    ]
  },
  {
    path: '/questionnaire',
    component: Layout,
    meta: {
      title: '问卷管理',
      icon: 'message'
    },
    children: [
      {
        path: 'add',
        component: () => import ('@/views/questionnaire/add'),
        meta: { title: '发布问卷', icon: 'edit', noCache: true, affix: true }
      },
      {
        path: 'addList',
        component: () => import ('@/views/questionnaire/addList'),
        meta: { title: '我的发布', icon: 'monitor', noCache: true, affix: true }
      },
      {
        path: 'queList',
        component: () => import ('@/views/questionnaire/queList'),
        meta: { title: '我的问卷', icon: 'build', noCache: true, affix: true }
      }
    ]
  }
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

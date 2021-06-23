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
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect')
  }]
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
  path: '/',
  component: Layout,
  redirect: 'index',
  children: [{
    path: 'index',
    component: () => import('@/views/index'),
    name: '首页',
    meta: {
      title: '首页',
      icon: 'dashboard',
      noCache: true,
      affix: true
    }
  }]
},
{
  path: '/exams',
  component: Layout,
  hidden: true,
  children: [{
    path: 'add',
    component: () => import('@/views/exam/add'),
    // name: '发布考试',
    meta: {
      title: '发布考试',
      icon: 'edit',
    },
    hidden: true
  },
  {
    path: 'detail',
    component: () => import('@/views/exam/addList/detail'),
    name: '我的发布详情',
    meta: {
      title: '我的发布详情',
      icon: 'build',
    },
    hidden: true
  },
  {
    path: 'single',
    component: () => import('@/views/exam/test/single'),
    // name: '单选题',
    meta: {
      title: '单选题',
      icon: 'monitor',
      noCache: true
    },
    hidden: true
  },
  {
    path: 'analytic',
    component: () => import('@/views/exam/test/analytic'),
    // name: '判断题',
    meta: {
      title: '考试结果',
      icon: 'monitor',
      noCache: true
    },
    hidden: true
  }, {
    path: 'excises',
    component: () => import('@/views/exam/excises'),
    hidden: true
  }
  ]
},
{
  path: '/user',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'profile',
    component: () => import('@/views/system/user/profile/index'),
    name: 'Profile',
    meta: {
      title: '个人中心',
      icon: 'user'
    }
  }]
},
{
  path: '/dict',
  component: Layout,
  hidden: true,
  children: [{
    path: 'type/data/:dictId(\\d+)',
    component: () => import('@/views/system/dict/data'),
    name: 'Data',
    meta: {
      title: '字典数据',
      icon: ''
    }
  }]
},
{
  path: '/job',
  component: Layout,
  hidden: true,
  children: [{
    path: 'log',
    component: () => import('@/views/monitor/job/log'),
    name: 'JobLog',
    meta: {
      title: '调度日志'
    }
  }]
},
{
  path: '/gen',
  component: Layout,
  hidden: true,
  children: [{
    path: 'edit',
    component: () => import('@/views/tool/gen/editTable'),
    name: 'GenEdit',
    meta: {
      title: '修改生成配置'
    }
  }]
},
{
  path: '/meetings',
  component: Layout,
  hidden: true,
  children: [{
    path: 'detail',
    component: () => import('@/views/meeting/addList/detail'),
    meta: {
      title: '会议详情',
      icon: 'monitor',
      noCache: true,
      affix: true
    },
  }, {
    path: 'detail',
    component: () => import('@/views/meeting/list/detail'),
    name: 'meeting',
    meta: { title: '会议列表' }
  }, {
    path: 'addRoom',
    component: () => import('@/views/meeting/room/add'),
    name: 'AddRoom',
    meta: { title: '添加会场' }
  }, {
    path: 'addRoom/:id',
    component: () => import('@/views/meeting/room/add'),
    name: 'UpdateRoom',
    meta: { title: '修改会场' }
  }, {
    path: 'detailRoom/:id',
    component: () => import('@/views/meeting/room/detail'),
    name: 'DetailRoom',
    meta: { title: '会场详情' }
  }]
},
{
  path: '/questions',
  component: Layout,
  hidden: true,
  children: [{
    path: 'test',
    component: () => import('@/views/questionnaire/add/test'),
    meta: { title: '编辑问卷'},
    hidden: true,
  }, {
    path: 'add',
    component: () => import('@/views/questionnaire/add/index'),
    meta: { title: '创建问卷'},
    hidden: true,
  }, {
    path: 'detailList',
    component: () => import('@/views/questionnaire/addList/detailList'),
    meta: { title: '查看结果'},
    hidden: true,
  }, {
    path: 'testDetail',
    component: () => import('@/views/questionnaire/addList/testDetail'),
    meta: { title: '问卷详情'},
    hidden: true,
  }]
},
{
  path: '/release',
  component: Layout,
  hidden: true,
  children: [{
    path: 'lawdetail/:id',
    component: () => import('@/views/file/release/detail'),
    hidden: true,
  }]
},
{
  path: '/files',
  component: Layout,
  hidden: true,
  children: [
    {
      path: 'detail/:id(\\d+)',
      component: (resolve) => require(['@/views/file/detail/index'], resolve),
      name: 'fileDetail',
      meta: { title: '法规文件详情' }
    },
    {
      path: 'mydetail/:id(\\d+)',
      component: (resolve) => require(['@/views/file/detail/index'], resolve),
      name: 'mydetail',
      meta: { title: '法规文件详情' }
    }, {
      path: 'addMain',
      component: (resolve) => require(['@/views/file/cate/addMain'], resolve),
      name: 'AddMainCate',
      meta: { title: '增加主分类' }
    }, {
      path: 'addMain/:id',
      component: (resolve) => require(['@/views/file/cate/addMain'], resolve),
      name: 'AddMainCateId',
      meta: { title: '修改主分类' }
    }, {
      path: 'addSub/:mainId',
      component: (resolve) => require(['@/views/file/cate/addSub'], resolve),
      name: 'AddMainSubCate',
      meta: { title: '增加子分类' }
    }, {
      path: 'subCate/:mainId',
      component: (resolve) => require(['@/views/file/cate/subCate'], resolve),
      name: 'LookMainSubCate',
      meta: { title: '查看子分类' }
    }
  ]
},
{
  path: '/plans',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addWork',
    component: () => import('@/views/plan/add/work'),
    name: 'AddWork',
    meta: {
      title: '创建工作计划'
    }
  }, {
    path: 'addWork:id',
    component: () => import('@/views/plan/add/work'),
    name: 'EditWork',
    meta: {
      title: '修改工作计划'
    }
  },
  {
    path: 'getDetail/:id',
    component: () => import('@/views/plan/list/detail'),
    name: 'PlanDetail',
    meta: {
      title: '周工作计划详情'
    }
  }
  // {
  //   path: 'addStudy',
  //   component: () => import('@/views/plan/add/study'),
  //   name: 'AddStudy',
  //   meta: {
  //     title: '创建学习计划'
  //   }
  // }
]
},
{
  path: '/todayworks',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addCate',
    component: () => import('@/views/todaywork/cate/add'),
    name: 'AddTodayworkCate',
    meta: {
      title: '创建工作分类'
    }
  }, {
    path: 'addCate/:id',
    component: () => import('@/views/todaywork/cate/add'),
    name: 'UpdateTodayworkCate',
    meta: {
      title: '修改工作分类'
    }
  }, {
    path: 'getCateDetail/:id',
    component: () => import('@/views/todaywork/dateworklist/detail'),
    name: 'TodayworkDetail',
    meta: {
      title: '工作详情'
    }
  }, {
    path: 'addTodaywork',
    component: () => import('@/views/todaywork/add'),
    name: 'AddTodaywork',
    meta: {
      title: '创建工作'
    }
  }, {
    path: 'addTodaywork/:id',
    component: () => import('@/views/todaywork/add'),
    name: 'UpdateTodaywork',
    meta: {
      title: '修改工作'
    }
  }]
}, {
  path: '/worklists',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addInspect',
    component: () => import('@/views/worklist/inspect/add'),
    name: 'AddInspect',
    meta: {
      title: '创建检查类工作'
    }
  }, {
    path: 'getInspectDetail/:id',
    component: () => import('@/views/worklist/inspect/detail'),
    name: 'InspectWorklistDetail',
    meta: {
      title: '专项工作详情'
    }
  }, {
    path: 'addActivity',
    component: () => import('@/views/worklist/activity/add'),
    name: 'AddActivity',
    meta: {
      title: '创建活动类工作'
    }
  }, {
    path: 'getActivityDetail/:id',
    component: () => import('@/views/worklist/activity/detail'),
    name: 'ActivityWorklistDetail',
    meta: {
      title: '专项工作详情'
    }
  }, {
    path: '/worklist/score/:id',
    component: () => import('@/views/worklist/inspect/score'),
    name: 'InspectWorklistScore',
    meta: {
      title: '结果录入'
    }
  }
  ]
}, {
  path: '/outsiders',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addOutsider',
    component: () => import('@/views/outsider/add'),
    name: 'AddOutsider',
    meta: {
      title: '外来人员登记'
    }
  }, {
    path: 'addOutsider/:id',
    component: () => import('@/views/outsider/add'),
    name: 'UpdateOutsider',
    meta: {
      title: '修改登记信息'
    }
  }, {
    path: 'getOutsiderDetail/:id',
    component: () => import('@/views/outsider/list/detail'),
    name: 'OutsiderDetail',
    meta: {
      title: '外来人员信息详情'
    }
  }]
}, {
  path: '/insiders',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addInfo',
    component: () => import('@/views/insider/info/add'),
    name: 'AddInsider',
    meta: {
      title: '添加人员信息'
    }
  }, {
    path: 'addInfo/:id',
    component: () => import('@/views/insider/info/add'),
    name: 'UpdateInsiderInfo',
    meta: {
      title: '修改人员信息'
    }
  }, {
    path: 'getInsiderDetail/:id',
    component: () => import('@/views/insider/info/detail'),
    name: 'InsiderDetail',
    meta: {
      title: '人员信息详情'
    }
  }, {
    path: 'addType',
    component: () => import('@/views/insider/type/add'),
    name: 'AddOutType',
    meta: {
      title: '添加外出类型'
    }
  }, {
    path: 'addType/:id',
    component: () => import('@/views/insider/type/add'),
    name: 'UpdateOutType',
    meta: {
      title: '修改外出类型'
    }
  }]
}, {
  path: '/dutys',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addDuty',
    component: () => import('@/views/duty/add'),
    name: 'AddDuty',
    meta: {
      title: '创建值班'
    }
  }, {
    path: 'addDuty/:id',
    component: () => import('@/views/duty/add'),
    name: 'UpdateDuty',
    meta: {
      title: '修改值班'
    }
  }]
}
]

export default new Router({
  mode: 'hash', // 去掉url中的#
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})



// 今日工作
import request from '@/utils/request'
// type 值1:历史今天，2：曝光问题，3：部门要事，4：事故通报，5：司机专栏，6：学习园地

//添加曝光信息
export const addExposure = (data = {}) => request({
    url: '/history/save',
    method: 'post',
    data
})
// 获取全部信息
export const exposureList = (data = {}) => request({
    url: `/history/selectHistory`,
    method: 'post',
    data
})
// 删除曝光信息
export const exposureDel = (id) => request({
    url: `/history/delById/` + id,
    method: 'get',
})
// 获取曝光信息详情
export const exposureDetail = (id) => request({
    url: `/history/getById/` + id,
    method: 'get',
})
// 修改曝光信息
export const exposureUpdate = (data = {}) => request({
    url: `/history/update`,
    method: 'post',
    data
})

// 分类统计
export const cateStatistics = (data = {}) => request({
    url: `/history/cateStatistics`,
    method: 'post',
    data
})

// 查询反馈
export const selectFeedBack = (data = {}) => request({
    url: `/history/selectFeedBack`,
    method: 'post',
    data
})

// 反馈统计
export const feedbackStatistics = (data = {}) => request({
    url: `/history/feedbackStatistics`,
    method: 'post',
    data
})
import request from '@/utils/request'


export const selectCate = (data = {}) => request({
    url: '/activityCate/selectCate',
    method: 'post',
    data
})

export const saveCate = (data = {}) => request({
    url: '/activityCate/save',
    method: 'post',
    data
})

export const getCateById = id => {
    return request({
        url: `/activityCate/getCateById/${id}`,
        method: 'get'
    })
}

export const updateCate = (data = {}) => request({
    url: '/activityCate/update',
    method: 'post',
    data
})

export const delCate = id => {
    return request({
        url: `/activityCate/delById/${id}`,
        method: 'get'
    })
}

export const saveActivity = (data = {}) => request({
    url: '/activity/save',
    method: 'post',
    data
})

export const selectActivity = (data = {}) => request({
    url: '/activity/selectActivity',
    method: 'post',
    data
})

export const getActivityById = id => {
    return request({
        url: `/activity/getById/${id}`,
        method: 'get'
    })
}

export const updateActivity = (data = {}) => request({
    url: '/activity/update',
    method: 'post',
    data
})

export const delActivity = id => {
    return request({
        url: `/activity/delById/${id}`,
        method: 'get'
    })
}

export const selectPersonByDept = () => request({
    url: '/person/selectPersonByDept',
    method: 'get',
})

export const saveScore = (data = {}) => request({
    url: '/activity/saveScore',
    method: 'post',
    data
})

// 根据活动id查询连队成绩排名
export const selectDeptScore = (data = {}) => request({
    url: '/activity/selectDeptScore',
    method: 'post',
    data
})

// 根据分类查询成绩排名
export const selectHistoryScore = (data = {}) => request({
    url: '/activity/selectHistoryScore',
    method: 'post',
    data
})

// 根据活动id查询成绩排名
export const selectScore = (data = {}) => request({
    url: '/activity/selectScore',
    method: 'post',
    data
})
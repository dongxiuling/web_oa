// 今日工作
import request from '@/utils/request'


// 获取工作类型
export const getTodayworkCate = (data = {}) => request({
    url: '/todayworkCate/selectCate',
    method: 'post',
    data
})

// 添加工作类型
export const saveTodayworkCate = (data = {}) => request({
    url: '/todayworkCate/save',
    method: 'post',
    data
})

export const getCateById = id => {
    return request({
        url: `/todayworkCate/getCateById/${id}`,
        method: 'get'
    })
}

export const updateTodayworkCate = (data = {}) => request({
    url: '/todayworkCate/update',
    method: 'post',
    data
})

export const delTodayworkCate = id => {
    return request({
        url: `/todayworkCate/delById/${id}`,
        method: 'get'
    })
}

export const saveTodaywork = (data = {}) => request({
    url: '/todaywork/save',
    method: 'post',
    data
})

export const getTodaywork = (data = {}) => request({
    url: '/todaywork/selectTodayWork',
    method: 'post',
    data
})

export const getTodayworkById = id => {
    return request({
        url: `/todaywork/getWorkById/${id}`,
        method: 'get'
    })
}

export const updateTodaywork = (data = {}) => request({
    url: '/todaywork/update',
    method: 'post',
    data
})

export const delTodaywork = id => {
    return request({
        url: `/todaywork/delById/${id}`,
        method: 'get'
    })
}
// 今日工作
import request from '@/utils/request'


export const getDutyList = (data = {}) => request({
    url: '/duty/selectDuty',
    method: 'post',
    data
})

export const delDuty = id => request({
    url: `/duty/delById/${id}`,
    method: 'get'
})

export const saveDuty = (data = {}) => request({
    url: '/duty/save',
    method: 'post',
    data
})

export const getDutyById = id => request({
    url: `/duty/getById/${id}`,
    method: 'get'
})

export const updateDuty = (data = {}) => request({
    url: '/duty/update',
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

// 周值班表
export const dutyStatistics = (data = {}) => request({
    url: '/duty/dutyStatistics',
    method: 'post',
    data
})


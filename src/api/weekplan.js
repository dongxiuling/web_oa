// 今日工作
import request from '@/utils/request'


export const selectWeekplan = (data = {}) => request({
    url: '/weekplan/selectWeekplan',
    method: 'post',
    data
})

export const delWeekplan = id => request({
    url: `/weekplan/delById/${id}`,
    method: 'get'
})

export const saveWeekplan = (data = {}) => request({
    url: '/weekplan/save',
    method: 'post',
    data
})

export const getWeekplanById = id => request({
    url: `/weekplan/getById/${id}`,
    method: 'get'
})

export const updateWeekplan = (data = {}) => request({
    url: '/weekplan/update',
    method: 'post',
    data
})

export const weekplanStatistics = (data = {}) => request({
    url: '/weekplan/weekplanStatistics',
    method: 'post',
    data
})


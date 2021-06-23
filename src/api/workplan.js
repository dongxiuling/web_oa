// 天气管理
import request from '@/utils/request'

export const saveWorkplan = (data = {}) => request({
    url: '/workplan/save',
    method: 'post',
    data
})

export const selectWorkplan = (data = {}) => request({
    url: '/workplan/selectMyPlan',
    method: 'post',
    data
})

export const upldateWorkplan = (data = {}) => request({
    url: '/workplan/update',
    method: 'post',
    data
})

export const getWorkplanById = id => {
    return request({
        url: `/workplan/getPlanById/${id}`,
        method: 'get'
    })
}

export const delWorkplanById = id => {
    return request({
        url: `/workplan/delPlanById/${id}`,
        method: 'get'
    })
}
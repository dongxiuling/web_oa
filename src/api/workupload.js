// 天气管理
import request from '@/utils/request'

export const saveWorkupload = (data = {}) => request({
    url: '/workupload/save',
    method: 'post',
    data
})

export const selectWorkupload = (data = {}) => request({
    url: '/workupload/selectWorkUpload',
    method: 'post',
    data
})

export const upldateWorkupload = (data = {}) => request({
    url: '/workupload/update',
    method: 'post',
    data
})

export const getWorkuploadById = id => {
    return request({
        url: `/workupload/getById/${id}`,
        method: 'get'
    })
}

export const delWorkuploadById = id => {
    return request({
        url: `/workupload/delById/${id}`,
        method: 'get'
    })
}
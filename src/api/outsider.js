import request from '@/utils/request'

export const saveOutsider = (data = {}) => request({
    url: '/in/save',
    method: 'post',
    data
})

export const selectOutsider = (data = {}) => request({
    url: '/in/selectIn',
    method: 'post',
    data
})

export const getOutsiderById = id => {
    return request({
        url: `/in/getInById/${id}`,
        method: 'get'
    })
}

export const updateOutsider = (data = {}) => request({
    url: '/in/update',
    method: 'post',
    data
})

export const delOutsiderById = id => {
    return request({
        url: `/in/delById/${id}`,
        method: 'get'
    })
}
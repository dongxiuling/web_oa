// 安全责任图
import request from '@/utils/request'

export const saveSafety = (data = {}) => request({
    url: '/safety/save',
    method: 'post',
    data
})

export const selectSafety = (data = {}) => request({
    url: '/safety/selectSafety',
    method: 'post',
    data
})
export const delSafety = id => {
    return request({
        url: `/safety/delById/${id}`,
        method: 'get'
    })
}

export const getSafetyById = id => {
    return request({
        url: `/safety/getSafetyById/${id}`,
        method: 'get'
    })
}

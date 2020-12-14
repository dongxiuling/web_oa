// 专项工作清单
import request from '@/utils/request'

// 保存检查类
export const saveInspect = (data = {}) => request({
    url: '/special/save',
    method: 'post',
    data
})

export const selectInspect = (data = {}) => request({
    url: '/special/list',
    method: 'post',
    data
})

export const delInspectById = id => {
    return request({
        url: `/special/delById/${id}`,
        method: 'get'
    })
}

export const filePreview = ({ ip, port, fid }) => {
    return request({
        url: `/special/preview/${ip}/${port}/${fid}`,
        method: 'get'
    })
}

export const getStep = (id) => {
    return request({
        url: `/special/getStep/${id}`,
        method: 'get'
    })
}
export const updateStep = (data = {}) => request({
    url: '/special/updateStep',
    method: 'post',
    data
})

export const getInspectById = id => {
    return request({
        url: `/special/get/${id}`,
        method: 'get'
    })
}

export const selectAcitvity = (data = {}) => request({
    url: '/special/save',
    method: 'post',
    data
})

export const delAcitvityById = id => {
    return request({
        url: `/weather/delWeatherById/${id}`,
        method: 'get'
    })
}

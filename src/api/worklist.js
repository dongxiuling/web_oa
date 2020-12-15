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
    data: {
        ...data,
        type: 0
    }
})

export const delWorklistById = id => {
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
    url: '/special/list',
    method: 'post',
    data: {
        ...data,
        type: 1
    }
})

export const saveActivity = (data = {}) => request({
    url: '/special/saveActivity',
    method: 'post',
    data
})

export const getActivityById = id => {
    return request({
        url: `/special/getActivity/${id}`,
        method: 'get'
    })
}

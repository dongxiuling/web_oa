// 专项工作清单
import request from '@/utils/request'

// 保存检查类
export const saveInspect = (data = {}) => request({
    url: '/special/save',
    method: 'post',
    data
})

export const selectInspect = () => {
    return request({
        url: `/special/list`,
        method: 'get'
    })
}

export const delInspectById = id => {
    return request({
        url: `/weather/delWeatherById/${id}`,
        method: 'get'
    })
}

export const filePreview = ({ ip, port, fid }) => {
    return request({
        url: `/special/preview/${ip}/${port}/${fid}`,
        method: 'get'
    })
}
import request from '@/utils/request'

export const exportPersonInfo = (data = {}) => {
    return request({
        url: '/person/export',
        method: 'post',
        responseType: 'blob',
        data
    })
}

export const importPersonInfo = ({ ip, port, fid }) => {
    return request({
        url: `/person/import/${ip}/${port}/${fid}`,
        method: 'get'
    })
}

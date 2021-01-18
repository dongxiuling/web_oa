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

export const selectPerson = (data = {}) => {
    return request({
        url: '/person/selectPerson',
        method: 'post',
        data
    })
}

export const savePerson = (data = {}) => request({
    url: '/person/save',
    method: 'post',
    data
})

export const getPersonById = id => request({
    url: `/person/getPersonById/${id}`,
    method: 'get'
})

export const updatePerson = (data = {}) => request({
    url: '/person/updatePerson',
    method: 'post',
    data
})

export const delPerson = id => {
    return request({
        url: `/person/delPersonById/${id}`,
        method: 'get'
    })
}
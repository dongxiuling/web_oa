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

// 外出类型
export const selectOutType = (data = {}) => {
    return request({
        url: '/personout/select',
        method: 'post',
        data
    })
}

export const saveOutType = (data = {}) => request({
    url: '/personout/save',
    method: 'post',
    data
})

export const updateOutType = (data = {}) => request({
    url: '/personout/update',
    method: 'post',
    data
})

export const getOutTypeById = id => request({
    url: `/personout/getPersonOutById/${id}`,
    method: 'get'
})

export const delOutType = id => {
    return request({
        url: `/personout/delById/${id}`,
        method: 'get'
    })
}
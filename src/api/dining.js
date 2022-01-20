// 伙食调查
import request from '@/utils/request'


export const getUnitList = (data = {}) => request({
    url: '/dining/findUnit',
    method: 'post',
    data
})

export const saveUnit = (data = {}) => request({
    url: '/dining/saveUnit',
    method: 'post',
    data
})

export const delUnitById = id => {
    return request({
        url: `/dining/delUnitById/${id}`,
        method: 'get'
    })
}

export const updateUnit = (data = {}) => request({
    url: '/dining/updateUnit',
    method: 'post',
    data
})

export const getDiningUnit = (data = {}) => request({
    url: '/dining/getDiningUnit',
    method: 'post',
    data
})



export const diningCreate = (data = {}) => request({
    url: '/dining/create',
    method: 'post',
    data
})

export const findDiningNaire = (data = {}) => request({
    url: '/dining/findDiningNaire',
    method: 'post',
    data
})

export const getDiningNaire = (data = {}) => request({
    url: '/dining/getDiningNaire',
    method: 'post',
    data
})

export const diningUpdate = (data = {}) => request({
    url: '/dining/update',
    method: 'post',
    data
})

export const delNaireById = id => {
    return request({
        url: `/dining/delNaireById/${id}`,
        method: 'get'
    })
}

export const delQuestionById = ({ id }) => {
    return request({
        url: `/dining/delQuestionById/${id}`,
        method: 'get'
    })
}

export const takeDiningNaire = id => {
    return request({
        url: `/dining/takeDiningNaire/${id}`,
        method: 'get'
    })
}

export const createQuestion = (data = {}) => request({
    url: '/dining/createQuestion',
    method: 'post',
    data
})

export const getQuestionById = (data = {}) => request({
    url: '/dining/getQuestionById',
    method: 'post',
    data
})

export const getScore = (data = {}) => request({
    url: '/dining/getScore',
    method: 'post',
    data
})

export const getDiningNaireContent = (data = {}) => request({
    url: '/dining/getDiningNaireContent',
    method: 'post',
    data
})
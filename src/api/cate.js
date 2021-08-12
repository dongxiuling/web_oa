import request from '@/utils/request'

// type 值1:历史今天，2：曝光问题，3：部门要事，4：事故通报，5：司机专栏，6：学习园地， 7：部队管理动态

export const getCate = (data = {}) => request({
    url: '/historyCate/selectCate',
    method: 'post',
    data
})

// 添加工作类型
export const saveCate = (data = {}) => request({
    url: '/historyCate/save',
    method: 'post',
    data
})

export const getCateById = id => {
    return request({
        url: `/historyCate/getCateById/${id}`,
        method: 'get'
    })
}

export const updateCate = (data = {}) => request({
    url: '/historyCate/update',
    method: 'post',
    data
})

export const delCate = id => {
    return request({
        url: `/historyCate/delById/${id}`,
        method: 'get'
    })
}
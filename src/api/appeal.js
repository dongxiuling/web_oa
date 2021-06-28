import request from '@/utils/request'

//添加申诉
export const addAppeal = (data = {}) => request({
    url: '/complaint/save',
    method: 'post',
    data
})
// 获取全部申诉
export const appealList = (data = {}) => request({
    url: `/complaint/selectComplaint`,
    method: 'post',
    data
})
// 删除申诉
export const appealDel = (id) => request({
    url: `/complaint/delById/`+id,
    method: 'get',
})

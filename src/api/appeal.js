import request from '@/utils/request'

//添加申诉
export const addAppeal = (data = {}) => request({
    url: '/complaint/save',
    method: 'post',
    data
})
// 获取全部申诉
export const appealList = (params) => request({
    url: `/complaint/selectComplaint/${params.size}/${params.current}/${params.hId}`,
    method: 'get'
})
// 删除申诉
export const appealDel = (id) => request({
    url: `/complaint/delById/` + id,
    method: 'get',
})

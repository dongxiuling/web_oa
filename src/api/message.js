import request from '@/utils/request'
// 获取消息类型
export function getType(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}
// 获取未读取消息列表
export function messageList(data) {
  return request({
    url: '/msg/selectMsg',
    method: 'post',
    data: data
  })
}
// 查询是否有未读取消息
export function hasMessage(data) {
  return request({
    url: '/msg/isMsg',
    method: 'post',
    data: data
  })
}
// 设置消息为已读
export function changeMessageStatus(data) {
  return request({
    url: '/msg/update',
    method: 'post',
    data: data
  })
}
import request from '@/utils/request'
// 获取字典内容 学习类型
export function getType(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}
// 添加学习内容
export function addStudy(data) {
    return request({
        url: '/learn/save',
        method: 'post',
        data:data
    })
}
// 测试socket地址
export function testSocket(data) {
  return request({
      url: 'resources/test',
      method: 'post',
      data:data
  })
}
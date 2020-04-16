import request from '@/utils/request'

// 查询生成表数据
export function getCategory(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}
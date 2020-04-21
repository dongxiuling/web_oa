import request from '@/utils/request'

// 查看考试分类
export function getCategory(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}
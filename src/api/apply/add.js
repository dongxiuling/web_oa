import request from '@/utils/request'

export function getType(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

export function getForm(params) {
  return request({
    url: '/formType/getFormsByFlowType/'+params.type,
    method: 'get'
  })
}


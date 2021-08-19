// 量化评比
import request from '@/utils/request'

export const addSeason = (data = {}) => request({
    url: '/quantification/save',
    method: 'post',
    data
})

export const seasonList = (data = {}) => request({
    url: `/quantification/selectQuantification`,
    method: 'post',
    data
})

export const seasonDel = (id) => request({
    url: `/quantification/delById/` + id,
    method: 'get',
})

export const seasonDetail = (id) => request({
    url: `/quantification/getById/` + id,
    method: 'get',
})

export const seasonUpdate = (data = {}) => request({
    url: `/quantification/update`,
    method: 'post',
    data
})

// 加减分细则

export const addItem = (data = {}) => request({
    url: '/quanItem/save',
    method: 'post',
    data
})

export const itemList = (data = {}) => request({
    url: `/quanItem/selectQuanItem`,
    method: 'post',
    data
})

export const itemDel = (id) => request({
    url: `/quanItem/delById/` + id,
    method: 'get',
})

export const itemDetail = (id) => request({
    url: `/quanItem/getQuanById/` + id,
    method: 'get',
})

export const itemUpdate = (data = {}) => request({
    url: `/quanItem/update`,
    method: 'post',
    data
})

export const selectTotal = (data = {}) => request({
    url: `/quantification/selectTotal`,
    method: 'post',
    data
})
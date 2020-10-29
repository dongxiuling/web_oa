// 天气管理
import request from '@/utils/request'

export const saveWeather = (data = {}) => request({
    url: '/weather/save',
    method: 'post',
    data
})

export const selectWeather = (data = {}) => request({
    url: '/weather/selectWeather',
    method: 'post',
    data
})

export const getWeatherById = id => {
    return request({
        url: `/weather/getWeatherById/${id}`,
        method: 'get'
    })
}

export const delWeatherById = id => {
    return request({
        url: `/weather/delWeatherById/${id}`,
        method: 'get'
    })
}
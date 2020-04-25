import request from '@/utils/request'

// 添加会议
export function addQuestion(data) {
    return request({
        url: '/naire/answer1',
        method: 'post',
        data: data
    })
}
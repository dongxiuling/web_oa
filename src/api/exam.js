import request from '@/utils/request'

// 查询我的考试
export function getMyExam(params) {
    return request({
        url: '/exam/findMyExamList',
        method: 'post',
        params
    })
}
// 查询我发布的考试
export function getCreatedExam(params) {
    return request({
        url: '/exam/findMyCreated',
        method: 'post',
        params
    })
}
// 修改考试
export function updateExam(params) {
    return request({
        url: '/exam/update',
        method: 'post',
        params
    })
}
// 添加考试
export function createExam(params) {
    return request({
        url: '/exam/create',
        method: 'post',
        params
    })
}
// 删除考试
export function delExam(query) {
    return request({
        url: 'exam/delExamById/' + query.id,
        method: 'post',
    })
}
// 修改考试 根据id获取考试信息
export function getExamById(params) {
    return request({
        url: '/exam/getById',
        method: 'post',
        params
    })
}
// 参加考试
export function takeExam(params) {
    return request({
        url: '/exam/takeExam',
        method: 'post',
        params
    })
}
// 回答问题
export function commitQuestion(params) {
    return request({
        url: '/exam/answer',
        method: 'post',
        params
    })
}
// 交卷
export function handExam(params) {
    return request({
        url: '/exam/examOver',
        method: 'post',
        params
    })
}
// 查看成绩
export function getExamScore(params) {
    return request({
        url: '/exam/getExamOver',
        method: 'post',
        params
    })
}
// 查看我的发布详情
export function getExamDetail(params) {
    return request({
        url: '/exam/getExamContent',
        method: 'post',
        params
    })
}

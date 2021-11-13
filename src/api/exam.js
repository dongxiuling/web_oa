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
        url: '/exam/findAllList',
        method: 'post',
        params
    })
}
// 修改考试
export function updateExam(data) {
    return request({
        url: '/exam/update',
        method: 'post',
        data: data
    })
}
// 添加考试
export function createExam(data) {
    return request({
        url: '/exam/create',
        method: 'post',
        data: data
    })
}
// 删除考试
export function delExam(id) {
    return request({
        url: 'exam/delExamById/' + id,
        method: 'get',
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

export function getExcisesList(params) {
    return request({
        url: '/exam/getQuestionByCate',
        method: 'post',
        params
    })
}

// 添加和修改考试题
export function addExam(params) {
    return request({
        url: '/exam/createExer',
        method: 'post',
        params
    })
}
// 删除考试题
export function delExer(query) {
    return request({
        url: '/exam/delExerById/' + query.id,
        method: 'get',
    })
}




// 获取考试类型
export const getExamCate = (data = {}) => request({
    url: '/examType/selectType',
    method: 'post',
    data
})

// 添加考试类型
export const saveExamCate = (data = {}) => request({
    url: '/examType/save',
    method: 'post',
    data
})

export const getCateById = id => {
    return request({
        url: `/examType/getById/${id}`,
        method: 'get'
    })
}

export const updateExamCate = (data = {}) => request({
    url: '/examType/update',
    method: 'post',
    data
})

export const delExamCate = id => {
    return request({
        url: `/examType/delById/${id}`,
        method: 'get'
    })
}

// 查看个人答题情况
// export const getExamAnswerInfo = (data = {}) => request({
//     url: '/exam/getExamAnswerInfo?aaa=111',
//     method: 'post',
//     data
// })

export const getExamAnswerInfo = (data) => request({
    url: `/exam/getExamAnswerInfo/${data.userId}/${data.examId}`,
    method: 'get'
})

export const getAvgScore = (data) => request({
    url: `/exam/getAvgScore/${data.id}`,
    method: 'get'
})

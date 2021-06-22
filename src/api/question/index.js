import request from '@/utils/request'

// 添加问卷
export function addQue(data) {
    return request({
        url: '/naire/create',
        method: 'post',
        data: data
    })
}

// 查询我发布的问卷列表
export function getAddList(data) {
    return request({
        url: '/naire/findMyCreated',
        method: 'post',
        data: data
    })
}

// 查询问卷下的题列表
export function getQueList(data) {
    return request({
        url: '/naire/takenaire/' + data.naireId,
        // url: '/naire/takenaire',
        method: 'get',
        // data: data
    })
}
// 修改添加习题
export function addTest(data) {
    return request({
        url: '/naire/createExer',
        method: 'post',
        data: data
    })
}


//查询我的问卷列表
export function getMyQuestion(data) {
    return request({
        url: '/naire/findMyNaireList',
        method: 'post',
        data: data
    })
}


//删除问卷题
export function delTest(data) {
    return request({
        url: '/naire/delExerById/' + data.id,
        method: 'get',
        // data: data
    })
}

// 查询哪些人已经填了问卷 
export function selectNaireInfo(data) {
    return request({
        url: '/naire/selectNaireInfo',
        method: 'post',
        data: data
    })
}

// 查询具体某个人某个问卷的答题情况
export function geTNaireContent(data) {
    return request({
        url: '/naire/geTNaireContent',
        method: 'post',
        data: data
    })
}

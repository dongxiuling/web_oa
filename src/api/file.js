import request from '@/utils/request'

// 添加法规文件内容
export function addContent(data) {
    return request({
        url: '/rawrule/store',
        method: 'post',
        data: data
    })
}
// 根据法规名称获取法规列表
export function getByTitle(title) {
    return request({
        url: '/rawrule/getRaw/'+title,
        method: 'get'
    })
}
// 获取法规列表
export function getRawList() {
    return request({
        url: '/rawrule/raw/list',
        method: 'get'
    })
}
// 获取法规列表
export function delLaw({id}) {
    return request({
        url: '/rawrule/domdel/'+id,
        method: 'get'
    })
}
// 获取法规详情
export function getLawDetail({id}) {
    return request({
        url: '/rawrule/dom/'+id,
        method: 'get'
    })
}
// 查询我发布的文件
export function getAddList(data) {
    return request({
        url: '/resources/selectMyCreated',
        method: 'post',
        data: data
    })
}
// 查询我的文件
export function getFileList(data) {
    return request({
        url: '/resources/selectMyResources',
        method: 'post',
        data: data
    })
}
// 查询全部文件
export function getALlList(data) {
    return request({
        url: '/resources/selectResources',
        method: 'post',
        data: data
    })
}
// 添加文件
export function fileSave(data) {
    return request({
        url: '/resources/save',
        method: 'post',
        data: data
    })
}

//修改的时候 根据id查询资料
export function getFileById(data) {
    return request({
        url: '/resources/getResourcesById/' + data.id,
        method: 'post',
        // data:data
    })
}

//修改资料
export function updateFile(data) {
    return request({
        url: '/resources/update',
        method: 'post',
        data: data
    })
}
//删除文件
export function deleteFile(data) {
    return request({
        url: '/resources/delResourcesById/' + data.id,
        method: 'get',
    })
}
// 下载资料
export function downLoadFile(data) {
    return request({
        url: '/resources/uplaodResources/' + data.id,
        method: 'get',
    })
}
//预览资料
export function readFile(data) {
    return request({
        url: '/resources/readResources/' + data.id,
        method: 'get',
    })
}
// 落实资料
export function finishFile(data) {
    return request({
        url: '/resources/doneResources/' + data.id,
        method: 'get',
    })
}

// 再次通知  查看阅读详情
export function getResources(data) {
    return request({
        url: '/resources/getResources/' + data.id,
        method: 'get',
    })
}


//修改资料
export function remindFile(data) {
    return request({
        url: '/resources/remind',
        method: 'post',
        data: data
    })
}

export function saveFileCate(data) {
    return request({
        url: '/resourcesCate/save',
        method: 'post',
        data: data
    })
}

export function getMainCate() {
    return request({
        url: '/resourcesCate/getCate',
        method: 'get',
    })
}

export function getSubCate({ mainId }) {
    return request({
        url: '/resourcesCate/getSubCate/' + mainId,
        method: 'get',
    })
}

export function delCate(id) {
    return request({
        url: '/resourcesCate/delById/' + id,
        method: 'get',
    })
}

export function updateCate(data) {
    return request({
        url: '/resourcesCate/update',
        method: 'post',
        data
    })
}

export function getCateById(id) {
    return request({
        url: '/resourcesCate/getCateById/' + id,
        method: 'get',
    })
}

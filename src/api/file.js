import request from '@/utils/request'

// 查询我发布的文件
export function getAddList(data) {
    return request({
        url: '/resources/selectMyCreated',
        method: 'post',
        data:data
    })
}
// 查询我的文件
export function getFileList(data) {
    return request({
        url: '/resources/selectMyResources',
        method: 'post',
        data:data
    })
}
// 查询全部文件
export function getALlList(data) {
    return request({
        url: '/resources/selectResources',
        method: 'post',
        data:data
    })
}
// 添加文件
export function fileSave(data) {
    return request({
        url: '/resources/save',
        method: 'post',
        data:data
    })
}

//修改的时候 根据id查询资料
export function getFileById(data) {
    return request({
        url: '/resources/getResourcesById/'+data.id,
        method: 'post',
        // data:data
    })
}
 
//修改资料
export function updateFile(data) {
    return request({
        url: '/resources/update',
        method: 'post',
        data:data
    })
}
//删除文件
export function deleteFile(data) {
    return request({
        url: '/resources/delResourcesById/'+data.id,
        method: 'get',
    })
}
// 下载资料
export function downLoadFile(data) {
    return request({
        url: '/resources/uplaodResources/'+data.id,
        method: 'get',
    })
}
//预览资料
export function readFile(data) {
    return request({
        url: '/resources/readResources/'+data.id,
        method: 'get',
    })
}
// 落实资料
export function finishFile(data) {
    return request({
        url: '/resources/doneResources/'+data.id,
        method: 'get',
    })
}

// 再次通知  查看阅读详情
export function getResources(data) {
    return request({
        url: '/resources/getResources/'+data.id,
        method: 'get',
    })
}


//修改资料
export function remindFile(data) {
    return request({
        url: '/resources/remind',
        method: 'post',
        data:data
    })
}
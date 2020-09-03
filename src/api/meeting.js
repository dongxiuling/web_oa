import request from '@/utils/request'

// 添加会议
export function meetingSave(data = {}) {
    return request({
        url: '/meeting/save',
        method: 'post',
        data: data
    })
}
// 查询我发布的会议
export function getAddList(data) {
    return request({
        url: '/meeting/selectMyCreated',
        method: 'post',
        data: data
    })
}
// 查询我的会议
export function getFileList(data) {
    return request({
        url: '/resources/selectMyResources',
        method: 'post',
        data: data
    })
}
//删除文件
export function deleteMeeting(data) {
    return request({
        url: '/meeting/delMeetingById/' + data.id,
        method: 'get',
    })
}
//修改的时候 根据id查询资料
export function getMeetingById(data) {
    return request({
        url: '/meeting/getMeetingById/' + data.id,
        method: 'post',
        // data:data
    })
}

//修改资料
export function updateMeeting(data) {
    return request({
        url: '/meeting/update',
        method: 'post',
        data: data
    })
}
//查看我发布的会议详情
export function getMeetingDetail(data) {
    return request({
        url: '/meeting/getReadById',
        method: 'post',
        data: data
    })
}
//查看我的会议详情
export function getMyMeetingDetail(data) {
    return request({
        url: '/meeting/readMeeting',
        method: 'post',
        data: data
    })
}
// 查询我的会议
export function getMeetingList(data) {
    return request({
        url: '/meeting/selectMyMeeting',
        method: 'post',
        data: data
    })
}

// 获取会场列表
export const getRoomListByDate = (data = {}) => request({
    url: '/room/selectRoomByDate',
    method: 'post',
    data
})

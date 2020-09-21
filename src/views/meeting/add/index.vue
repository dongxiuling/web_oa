<template>
  <div>
    <FullCalendar ref="fullCalendar" :options="calendarOptions" v-loading="loading" />

    <el-drawer title="会议预定" :visible.sync="drawer" :with-header="false">
      <book :meeting="bookConfig" @close-event="closeEvent" @book-success="bookSuccess" />
    </el-drawer>

    <!-- <el-popover
      placement="bottom"
      title="标题"
      width="200"
      trigger="manual"
      content="123123"
      :offset="100"
      :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }"
      v-model="visible"
    ></el-popover>-->
    <div :class="{active: isHide}" :style="positionObj" class="pop">
      <div>
        <span class="label">会议名称：</span>
        {{eventDetail.title}}
      </div>
      <div>
        <span class="label">会议内容：</span>
        <span v-html="eventDetail.content"></span>
      </div>
      <div>
        <span class="label">开始时间：</span>
        {{eventDetail.start}}
      </div>
      <div>
        <span class="label">结束时间：</span>
        {{eventDetail.end}}
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import dayGridPlugin from '@fullcalendar/daygrid'; // for dayGridMonth view
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import '@fullcalendar/core/locales/zh-cn.js'
import Book from './book.vue'
import { dateFormat } from "@/utils/format";
import { getRoomListByDate } from "@/api/meeting";


export default {
  components: {
    FullCalendar,
    Book
  },
  data() {
    return {
      drawer: false,
      bookConfig: {},
      visible: false,
      roomList: [],
      loading: false,
      isHide: true,
      positionObj: { top: 0, left: 0 },
      eventDetail: {
      },
      calendarOptions: {
        locale: "zh-cn",
        plugins: [resourceTimelinePlugin, interactionPlugin],
        titleFormat: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '日',
          list: '列表'
        },
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        initialView: 'resourceTimelineDay',
        dateClick: this.handleDateClick,
        selectable: true,
        select: selectionInfo => {
          // console.log(selectionInfo)
          // console.log('selected ' + selectionInfo.startStr + ' to ' + selectionInfo.endStr)
          this.drawer = true
          this.bookConfig = {
            start: dateFormat("YYYY-mm-dd HH:MM:SS", selectionInfo.start),
            end: dateFormat("YYYY-mm-dd HH:MM:SS", selectionInfo.end),
            roomId: selectionInfo.resource._resource.id,
            roomName: selectionInfo.resource._resource.title
          }
        },
        resourceAreaWidth: '20%',
        resourceAreaColumns: [
          {
            field: 'title',
            headerContent: '会场名称'
          },
          {
            field: 'occupancy',
            headerContent: '最大容纳人数'
          }
        ],
        // resources: 'https://fullcalendar.io/demo-resources.json?with-nesting&with-colors',
        // events: 'https://fullcalendar.io/demo-events.json?single-day&for-resource-timeline'
        // resources: [
        //   { id: 1, title: '第一会场', occupancy: 40 },
        //   { id: 2, title: '第二会场', occupancy: 60 },
        //   { id: 3, title: '第三会场', occupancy: 50 },
        //   { id: 4, title: '第四会场', occupancy: 100 },
        //   { id: 5, title: '第五会场', occupancy: 80 },
        // ],
        resources: [],
        // events: [
        //   {
        //     resourceId: 1,
        //     title: '全体大会',
        //     start: '2020-08-26T01:00:00+08:00',
        //     end: '2020-08-26T12:00:00+08:00',
        //     color: 'orange'
        //   },
        //   {
        //     resourceId: 2,
        //     title: '开会啦',
        //     start: '2020-08-26T11:00:00+08:00',
        //     end: '2020-08-26T22:00:00+08:00',
        //     color: 'green'
        //   },
        //   {
        //     resourceId: 3,
        //     title: '开会啦',
        //     start: '2020-08-26T10:00:00+08:00',
        //     end: '2020-08-26T14:00:00+08:00',
        //     // color: 'blue'
        //   }
        // ],
        events: async (fetchInfo, successCallback, failureCallback) => {
          const roomList = await this.getRoomList(fetchInfo)
          const eventArr = []
          roomList.forEach(({ tms }) => {
            if (tms) {
              tms.forEach((item) => {
                const obj = {
                  resourceId: item.roomId,
                  title: item.title,
                  start: item.startTime,
                  end: item.endTime,
                  content: item.content
                  // color: 'orange'
                }
                eventArr.push(obj)
              })
            }
          })
          return eventArr
        },
        // eventClick: (info) => {
        //   console.log(info);
        //   console.log('Event: ' + info.event.title);
        //   console.log('content: ' + info.event._def.extendedProps.content);
        //   console.log('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        //   console.log('View: ' + info.view.type);
        // },
        eventMouseEnter: (info) => {
          this.isHide = false
          // console.log(info);
          // console.log('Event: ' + info.event.title);
          // console.log('content: ' + info.event._def.extendedProps.content);
          this.positionObj = {
            left: info.jsEvent.pageX - 260 + 'px',
            top: info.jsEvent.pageY - 60 + 'px'
          }
          this.eventDetail = {
            title: info.event.title,
            content: info.event._def.extendedProps.content,
            start: dateFormat('YYYY-mm-dd HH:MM:SS', info.event.start),
            end: dateFormat('YYYY-mm-dd HH:MM:SS', info.event.end)
          }
        },
        eventMouseLeave: () => {
          this.isHide = true
        }
      }
    }
  },
  methods: {
    async getRoomList({ startStr, endStr }) {
      const start = dateFormat('YYYY-mm-dd HH:MM:SS', startStr).split(' ')[0]
      const res = await getRoomListByDate({
        date: start
      })
      if (res && res.code === '200') {
        const roomList = res.data
        roomList.forEach(room => {
          room.title = room.name
          room.occupancy = room.num
        })
        this.calendarOptions.resources = roomList
        return roomList
      }

    },
    handleDateClick: function (arg) {
      console.log('date click! ' + arg.dateStr)
    },
    bookSuccess(info) {
      this.drawer = false
      this.calendarApi.addEvent({
        resourceId: info.roomId,
        title: info.title,
        start: info.startTime,
        end: info.endTime,
        content: info.content
      })
    },
    closeEvent() {
      this.drawer = false
      this.bookConfig = {}
    }
  },
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi()
  }
}

</script>

<style lang="scss" scoped>
.pop {
  width: 280px;
  background: #fff;
  position: absolute;
  z-index: 999;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  color: #606266;
  line-height: 1.6;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  word-break: break-all;
  padding: 12px;
}
// .pop::after {
//   content: "";
//   border-width: 10px;
//   border-style: solid;
//   border-color: transparent transparent #fff transparent;
//   width: 0;
//   height: 0;
//   position: absolute;
//   top: -20px;
//   left: 50%;
//   transform: translateX(-50%);
// }
.active {
  display: none;
}
.label {
  color: #000;
}
</style>


<template>
  <div>
    <FullCalendar :options="calendarOptions" />

    <el-drawer title="会议预定" :visible.sync="drawer" :with-header="false">
      <book :bookConfig="bookConfig"/>
    </el-drawer>

    <el-popover
      placement="bottom"
      title="标题"
      width="200"
      trigger="manual"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
      v-model="visible"
    ></el-popover>
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

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    Book
  },
  data() {
    return {
      drawer: false,
      bookConfig: {},
      visible: true,
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
          console.log(selectionInfo)
          console.log('selected ' + selectionInfo.startStr + ' to ' + selectionInfo.endStr)
          this.drawer = true
          console.log(dateFormat("YYYY-mm-dd HH:MM:SS", selectionInfo.start))
          console.log(dateFormat("YYYY-mm-dd HH:MM:SS", selectionInfo.end))
          // this.content = selectionInfo.startStr + ' 到 ' + selectionInfo.endStr
          this.bookConfig = {
            start: dateFormat("YYYY-mm-dd HH:MM:SS", selectionInfo.start),
            end: dateFormat("YYYY-mm-dd HH:MM:SS", selectionInfo.end),
            roomId: 1
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
        resources: [
          { id: 1, title: '第一会场', occupancy: 40 },
          { id: 2, title: '第二会场', occupancy: 60 },
          { id: 3, title: '第三会场', occupancy: 50 },
          { id: 4, title: '第四会场', occupancy: 100 },
          { id: 5, title: '第五会场', occupancy: 80 },
        ],
        events: [
          {
            resourceId: 1,
            title: '全体大会',
            start: '2020-08-26T01:00:00+08:00',
            end: '2020-08-26T12:00:00+08:00',
            color: 'orange'
          },
          {
            resourceId: 2,
            title: '开会啦',
            start: '2020-08-26T11:00:00+08:00',
            end: '2020-08-26T22:00:00+08:00',
            color: 'green'
          },
          {
            resourceId: 3,
            title: '开会啦',
            start: '2020-08-26T10:00:00+08:00',
            end: '2020-08-26T14:00:00+08:00',
            // color: 'blue'
          }
        ],
        eventClick: info => {
          console.log(info);
          console.log('Event: ' + info.event.title);
          console.log('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
          console.log('View: ' + info.view.type);
          // this.visible = true
          this.drawer = true
          this.content = info.event.title
        }
      }
    }
  },
  methods: {
    handleDateClick: function (arg) {
      console.log('date click! ' + arg.dateStr)
    },
    getRoomList() {

    }
  },
  mounted() {

  }
}

</script>


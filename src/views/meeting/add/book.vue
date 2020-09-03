<template>
  <div class="app-container" v-loading="loading">
    <el-form ref="meeting" :model="meeting" :rules="rules" label-width="80px">
      <el-form-item label="会议名称" prop="title">
        <el-input v-model="meeting.title" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="会议地点" prop="roomName">
        <el-input disabled v-model="meeting.roomName" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="会议内容" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入会议内容"
          v-model="meeting.content"
        ></el-input>
      </el-form-item>

      <el-form-item label="开始时间" prop="start">
        <el-date-picker v-model="meeting.start" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="end">
        <el-date-picker v-model="meeting.end" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>

      <el-form-item label="参会人员">
        <el-tree
          :data="deptTree"
          show-checkbox
          node-key="id"
          ref="tree"
          :props="defaultProps"
          @check="getCheckedNodes()"
          :default-checked-keys="meeting.userIds"
        ></el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('meeting')">立即预订</el-button>
        <el-button @click="resetForm('meeting')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { meetingSave, getMeetingById, updateMeeting } from "@/api/meeting";
import { listUser, getTreeUser } from "@/api/system/user";
import { dateFormat } from "@/utils/format";

export default {
  props: {
    meeting: {
      type: Object,
      default: function () {
        return { userIds: [] }
      }
    }
  },
  data() {
    return {
      deptTree: [],
      loading: false,
      // meeting: {
      //   title: "",
      //   roomName: "",
      //   roomId: "",
      //   content: "",
      //   userIds: []
      // },
      date: "",
      time: "",
      id: this.$route.query.id,
      rules: {
        title: [{ required: true, message: "请输入会议名称", trigger: "blur" }],
        roomName: [{ required: true, message: "请输入地点名称", trigger: "blur" }],
        content: [
          { required: true, message: "请输入会议内容", trigger: "blur" }
        ],
        start: [{ required: true, message: "请输入会议开始时间" },
        { validator: this.validateDate, trigger: ['blur', 'change'] }],
        end: [{ required: true, message: "请输入会议结束时间" },
        { validator: this.validateDate, trigger: ['blur', 'change'] }],
        userIds: [
          { required: true, message: "请选择参会人员", trigger: "change" }
        ]
      },
      props: {
        label: "name",
        children: "zones"
      },
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      }
    };
  },
  computed: {
    startTime() {
      return this.date + " " + this.time + ":00";
    }
  },
  methods: {
    validateDate(rule, value, callback) {
      const { start, end } = this.meeting
      if (new Date(start) >= new Date(end)) {
        callback(new Error('会议开始时间必须早于结束时间'))
      } else {
        callback()
      }
    },
    //获取选中状态下的人员数据
    getCheckedNodes() {
      this.meeting.userIds = this.$refs.tree.getCheckedNodes(true).map(item => item.id);
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      getTreeUser().then(response => {
        this.deptTree = response.data;
      });
    },
    submitForm(formName) {
      this.loading = true
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.meeting.userIds) {
            this.$message({
              message: "请选择参会人员",
              type: "warning"
            });
            this.loading = false
            return false
          }
          this.addHandle();
        } else {
          console.log("error submit!!");
          this.loading = false
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.meeting.userIds = []
      this.$emit('close-event')
    },
    // 添加会议
    async addHandle() {
      this.meeting.startTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.meeting.start)
      this.meeting.endTime = dateFormat("YYYY-mm-dd HH:MM:SS", this.meeting.end)
      // console.log(this.meeting);
      const res = await meetingSave(this.meeting)
      if (res && res.code === '200') {
        this.$message({
          message: "预定成功",
          type: "success"
        });
        this.$emit('book-success', this.meeting)
      } else if (res && res.code === '20000') {
        this.$message({
          message: "预定失败，会议时间冲突，请重新选择",
          type: "warning"
        });
      } else if (res && res.code === '50000') {
        this.$message({
          message: "预定失败",
          type: "warning"
        });
      }
      this.loading = false
    },
  },
  mounted() {
    // 获取部门树形结构
    this.getDeptTreeselect();
    if (this.id) {
      this.getMeetingById(this.id);
    }
  },
};
</script>
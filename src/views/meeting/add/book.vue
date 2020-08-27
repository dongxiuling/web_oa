<template>
  <div class="app-container">
    <el-form ref="meeting" :model="meeting" :rules="rules" label-width="80px">
      <el-form-item label="会议名称" prop="title">
        <el-input v-model="meeting.title" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="会议地点" prop="place">
        <el-input v-model="meeting.place" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="会议内容" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入会议内容"
          v-model="meeting.content"
        ></el-input>
      </el-form-item>

      <el-form-item label="开始时间" prop="meetingStart">
        <el-date-picker v-model="bookConfig.start" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="meetingEnd">
        <el-date-picker v-model="bookConfig.end" type="datetime" placeholder="选择日期时间"></el-date-picker>
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
        <el-button v-if="$route.query.id" type="primary" @click="updateHandle('meeting')">确定修改</el-button>
        <el-button v-else type="primary" @click="submitForm('meeting')">立即预订</el-button>
        <el-button @click="resetForm('meeting')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { meetingSave, getMeetingById, updateMeeting } from "@/api/meeting";
import { listUser, getTreeUser } from "@/api/system/user";
export default {
  props: {
    bookConfig: Object
  },
  data() {
    return {
      deptTree: [],
      meeting: {
        title: "",
        place: "",
        content: "",
        userIds: []
      },
      date: "",
      time: "",
      id: this.$route.query.id,
      rules: {
        title: [{ required: true, message: "请输入会议名称", trigger: "blur" }],
        place: [{ required: true, message: "请输入地点名称", trigger: "blur" }],
        content: [
          { required: true, message: "请输入会议内容", trigger: "blur" }
        ],
        meetingStart: [{ type: 'date', required: true, message: "请输入开始时间", trigger: "change" }],
        meetingEnd: [{ type: 'date', required: true, message: "请输入结束时间", trigger: "change" }],
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
    //获取选中状态下的人员数据
    getCheckedNodes() {
      this.meeting.userIds = this.$refs.tree.getCheckedNodes(true).map(item => {
        return item.id;
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      getTreeUser().then(response => {
        this.deptTree = response.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addHandle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加会议
    addHandle() {
      meetingSave({
        ...this.meeting,
        startTime: this.startTime
      }).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/meeting/addlist");
      });
    },
    // 修改会议
    updateHandle() {
      updateMeeting({ ...this.meeting, startTime: this.startTime }).then(
        res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.$router.push("/meeting/addlist");
        }
      );
    },
    // 修改考试获取信息
    getMeetingById(id) {
      getMeetingById({ id }).then(res => {
        this.meeting = res.data;
        let arr = res.data.startTime.split(" ");
        this.date = arr[0];
        this.time = arr[1].substring(0, arr[1].length - 3);
      });
    }
  },
  created() {
    // 获取部门树形结构
    this.getDeptTreeselect();
    if (this.id) {
      this.getMeetingById(this.id);
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (!to.query.id) {
      this.meeting = {
        title: "",
        place: "",
        content: "",
        userIds: []
      },
        this.date = "";
      this.time = "";
    }
    next();
  }
};
</script>
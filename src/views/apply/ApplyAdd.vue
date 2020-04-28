<template>
  <div class="app-container">
    <el-row>
      <!-- 左侧分类导航 start -->
      <el-col :span="3">
        <h5 class="left-title">申请类别</h5>
        <el-tabs @tab-click="changeType" tab-position="left" style="height: 200px;">
          <el-tab-pane
            v-for="item in processType.list"
            :key="item.dictLabel"
            :label="item.dictLabel"
          ></el-tab-pane>
        </el-tabs>
      </el-col>
      <!-- 右侧表单部分 -->
      <el-col :span="21">
        <div class="right-content">
          <!-- 顶部按钮区域 star -->
          <el-alert class="form-title" title="车辆申请" type="info" center :closable="false"></el-alert>
          <!-- 动态表单 -->
          <apply-form/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ApplyForm from './components/ApplyForm.vue'
import { getType } from "@/api/apply/add";
export default {
  data() {
    return {
      processType: {
        //流程分类列表
        list: [],
        now: {}
      }
    };
  },
  components:{
    ApplyForm
  },
  created() {
    this.getWorkFollowType();
  },
  methods: {
    //获取流程分类
    getWorkFollowType() {
      let querySting = {
        pageNum: 1,
        pageSize: 10,
        dictType: "flow_type"
      };
      getType(querySting).then(res => {
        this.processType.list = res.rows;
        this.changeType({ index: 0 });
      });
    },
    //切换左侧申请类型
    changeType(tab) {
      let thisIndex = tab.index;
      this.processType.now = this.processType.list[thisIndex];
    },
  }
};
</script>
<style scoped>
.left-title {
  margin: 10px 25px;
}
.add-form {
  width: 80%;
  margin: 0 auto;
}
.right-content{
  width: 60%;
}
.form-title {
  margin-bottom: 20px;
  font-weight: bolder;
}
</style>
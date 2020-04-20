<template>
  <div id="release">
    <div id="main">
      <div class="top" />
      <div class="bottom">
        <div id="title">添加调查问卷</div>
        <div id="question">
          <span style="margin-right:10px;">题目</span>
          <el-input v-model="input" placeholder="请输入题目" clearable style="width:755px;height:45px;" />
        </div>
        <div class="option">
          <span style="display:inline-block;width:32px;text-align:right;margin-right:10px;">A</span>
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" style="display:inline-block;width:755px;height:55px"/>
        </div>
        <div class="option">
          <span style="display:inline-block;width:32px;text-align:right;margin-right:10px;">B</span>
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" style="display:inline-block;width:755px;height:55px"/>
        </div>
        <div class="option">
          <span style="display:inline-block;width:32px;text-align:right;margin-right:10px;">C</span>
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" style="display:inline-block;width:755px;height:55px"/>
        </div>
        <div class="option">
          <span style="display:inline-block;width:32px;text-align:right;margin-right:10px;">D</span>
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" style="display:inline-block;width:755px;height:55px"/>
        </div>
        <el-row style="margin-left:755px;margin-top:110px;">
          <el-button>取消</el-button>
          <el-button type="primary">添加</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      textarea: ''
    }
  }
}
</script>

<style lang="scss" scoped>
#release {
  padding-left: 20px;
  padding-top: 25px;
  background: #f0f2f5;
}
#main {
  background: #ffffff;
}
.top {
  height: 70px;
  width: 100%;
  border-bottom: 2px solid #f0f2f5;
}
.bottom {
  height: 735px;
  width: 100%;
}
#title{
  margin-top: 65px;
  margin-left: 60px;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}
#question {
  margin-left: 120px;
  margin-top: 25px;
  font-size: 14px;
  font-weight: 600;
}
.option{
  height: 55px;
  line-height: 55px;
  margin-left: 120px;
  margin-top: 25px;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
}
</style>

<template>
  <div class="done-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>答案解析</span>
        </div>
        <div class="test-number-box">
          <h4>每题得分</h4>
          <div class="test-number">
            <span>1</span>
            <span class="error">2</span>
            <span class="now">3</span>
          </div>
        </div>
        <div class="answer-container">
          <h4>
            <i class="el-icon-question"></i>若有说明语句“int a[10],*p=a;”，对数组元素的正确引用是?
          </h4>
          <div class="answer-list-box">
            <p>正确答案: D 你的答案: D (正确)</p>
            <ul>
              <li>a[p]</li>
              <li>a[p]</li>
              <li>a[p]</li>
              <li>a[p]</li>
            </ul>
          </div>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss"  scoped>
.done-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
  .test-number-box {
    border-bottom: 1px solid #e6ebf5;
    padding-bottom: 20px;
    .test-number {
      span {
        display: inline-block;
        width: 32px;
        height: 32px;
        background: #1abc9c;
        color: #fff;
        text-align: center;
        line-height: 32px;
        vertical-align: middle;
        margin-bottom: 10px;
        &.error {
          background: #ff431e;
        }
        &.now {
          height: 40px;
          line-height: 40px;
          margin-top: -4px;
        }
      }
    }
  }
  .answer-container {
    .el-icon-question {
      color: #1abc9c;
      font-size: 20px;
      margin-right: 5px;
    }
    p{
        margin-bottom: 30px;
    }
    ul {
      padding: 0;
      li {
        list-style: none;
        padding: 10px;
        border:1px solid #d4d4d4;
        margin-bottom: 10px;
        background: #fff;
        border-radius: 5px;
      }
    }
    .answer-list-box{
        background: #f9f9f9;
        padding: 20px;
    }
  }
}
</style>

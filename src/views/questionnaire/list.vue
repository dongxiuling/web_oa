<template>
  <div id="release">
    <div id="main">
      <div class="top">
        <div class="title">问卷调查列表</div>
      </div>
      <div class="bottom">
        <div class="search">
          <span style="float:left;">标题:</span>
          <el-input v-model="input" placeholder="请输入" clearable style="width:400px;float:left;margin-left:5px;margin-right:400px;" />
          <el-button type="primary" style="float:left;">主要按钮</el-button>
        </div>
        <el-table :data="list_data" :show-header="false" style="width: 100%">
          <el-table-column prop="title" width="180" />
          <el-table-column prop="describe" width="180" />
          <el-table-column prop="time_a" />
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
              <el-button type="text" size="small">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total,slot,->,  prev, pager, next,sizes, jumper" :total="400">
          <span>第{{ currentPage4 }}/{{ total }}页</span>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      currentPage4: 1,
      total: 80,
      list_data: [
        {
          id: 1,
          title: 'test1',
          describe: '一个简短的简介',
          time_a: '2016-09-21  08:50:08'
        },
        {
          id: 2,
          title: 'test2',
          describe: '一个简短的简介',
          time_a: '2016-09-21  08:50:08'
        },
        {
          id: 3,
          title: 'test3',
          describe: '一个简短的简介',
          time_a: '2016-09-21  08:50:08'
        },
        {
          id: 4,
          title: 'test4',
          describe: '一个简短的简介',
          time_a: '2016-09-21  08:50:08'
        }
      ]
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage4 = `${val}`
      console.log(`当前页: ${val}`)
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
.title {
  height: 70px;
  line-height: 70px;
  margin-left: 50px;
  font-size: 20px;
}
.search {
  margin-top: 50px;
  margin-left: 100px;
  overflow: hidden;
  line-height: 36px;
}
</style>

<template>
  <div class="list">
    <el-table border :data="cateData" style="width: 100%">
      <el-table-column label="序号" type="index">
      </el-table-column>
      <el-table-column label="分类" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.dictLabel }}</span>
        </template>
      </el-table-column>
      <el-table-column class="handle_row" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="GoExcises(scope.row)">添加考试题</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getCategory } from "@/api/tool/category.js";
export default {
  data() {
    return {
      cateData: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getCategory({
        pageNum: 1,
        pageSize: 1000,
        dictType: "sys_module_name"
      }).then(res => {
        this.cateData = res.rows;
      });
    },
    GoExcises(_data) {
      this.$router.push({path:"/exams/excises/",query:{cateId:_data.dictCode}})
    }
  }
};
</script>
<style lang="scss" scoped>
.list {
  padding: 20px;
}
.add_btn {
  float: right;
  margin-bottom: 10px;
}
.pages {
  float: right;
}
</style>
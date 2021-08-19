<template>
  <div class="list">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="问卷名称">
        <el-input
          placeholder="请输入问卷名称"
          v-model="search.title"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="searchHandle()"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="reSetHandle()"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/questions/add')"
          >创建问卷</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="addList" style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        :index="(currentPage - 1) * pageSize + 1"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="title"
        label="问卷名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="endDate"
        label="截止时间"
      ></el-table-column>
      <el-table-column align="center" label="完成人数 / 总人数">
        <template slot-scope="scope">
          <span>{{ scope.row.completeNum }} / {{ totalPersonNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class="handle_row" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="goExcises(scope.row)"
            >编辑问卷</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click.stop="look(scope.row)"
            >查看结果</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="delItem(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination
        style="width: 100%"
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getAddList, delNaire, selectNaireInfo } from "@/api/question/index";
import { selectPerson } from "@/api/insider.js";

export default {
  data() {
    return {
      search: {},
      addList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      totalPersonNum: 0
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await getAddList({
        title: this.search.title,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      if (res && res.code == 200 && res.data) {
        this.addList = res.data.records;
        this.total = res.data.total

        // 查询人数总数
        const res2 = await selectPerson({
          current: 0,
          size: 9999,
          deptId: 0
        })
        // console.log(res2);
        if (res2 && res2.code == 200 && res2.data) {
          this.totalPersonNum = res2.data.total

          // 查询每个问卷的完成人数
          this.addList.map(async (item, index) => {
            const res3 = await selectNaireInfo({
              deptId: 0,
              naireId: item.id,
              current: 0,
              size: 99999
            })
            // console.log(res3);
            let sum = 0
            res3.data.records.map(r => {
              if (r.isCompleted > 0) {
                sum++
              }
            })
            this.$set(this.addList[index], 'completeNum', sum)
          })
          console.log(111);
          console.log(this.addList);
        }
      }
    },
    goExcises(_data) {
      this.$router.push({
        path: "/questions/test/",
        query: { naireId: _data.id }
      });
    },
    look(_data) {
      this.$router.push({
        path: "/questions/detailList/",
        query: { naireId: _data.id }
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.getData();
    },
    delItem(item) {
      this.$confirm("此操作将永久删除且无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delNaire(item.id).then((res) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });

    },
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
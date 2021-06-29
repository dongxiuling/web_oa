<template>
  <!-- 首页文章列表 -->
  <!-- type 值1:历史今天，2：曝光问题，3：部门要事，4：事故通报，5：司机专栏，6：学习园地 -->
  <div class="container">
    <div></div>
    <div class="content">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ title }}</span>
        </div>

        <el-table :data="dataList" style="width: 100%" v-loading="loading">
          <el-table-column type="index" width="150" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="title" label="名称" align="center"></el-table-column>
          <el-table-column prop="createTime" label="添加时间" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click.stop="showDetail(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination
            layout="total, prev, pager, next, jumper"
            :total="total"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { exposureList } from "@/api/exposure";
export default {
  props: ["type"],
  data() {
    return {
      searchText: "",
      dataList: [],
      loading: false,
      currentPage: 1, //分页当前页
      pageSize: 10,
      total: 0, //总页数
    };
  },
  methods: {




    // 获取法规列表数据
    getList() {
      this.loading = true;
      exposureList({
        current: this.currentPage,
        size: this.pageSize,
        type: this.type,
      }).then((res) => {
        // console.log(res);
        this.dataList = res.data.records;
        this.loading = false;
        this.total = res.data.total
      });
    },
    // 初始化数据
    initData() {
      this.currentPage = 1;
      this.getList();
    },

    // 查看详情
    showDetail(_data) {
      this.$router.push({
        path: "/exposure_/detail/" + _data.id,
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
  computed: {
    title() {
      let _title = ""
      let _type = this.type * 1;
      switch (_type) {
        case 1: _title = "历史今天"; break;
        case 2: _title = "曝光问题"; break;
        case 3: _title = "部门要事"; break;
        case 4: _title = "事故通报"; break;
        case 5: _title = "司机专栏"; break;
        case 6: _title = "学习园地"; break;
        default: _title = "无";
      }
      return _title
    }
  }
};
</script>
<style scoped>
li {
  list-style: none;
}
.container {
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.content::after {
  content: "";
  display: block;
  clear: both;
}

.page-box {
  padding: 20px 0;
  float: right;
}
</style>
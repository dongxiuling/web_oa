<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="计划名称" prop="roleName">
        <el-input
          v-model="search.name"
          placeholder="请输入计划名称"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="search.type" placeholder="请选择计划类型">
          <el-option v-for="item in typeList" :key="item.id" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="onSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/plans/addWork')"
        >创建工作计划</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('/plans/addStudy')"
        >创建学习计划</el-button>
      </el-col>
    </el-row>

    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="序号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="计划名称"></el-table-column>
      <el-table-column align="center" prop="startDate" label="开始日期"></el-table-column>
      <el-table-column align="center" prop="endDate" label="结束日期"></el-table-column>
      <el-table-column align="center" prop="type" label="类型"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Uploader from '@/components/Uploader'
import Treeselect from "@riophae/vue-treeselect";
export default {
  components: { Uploader },
  data() {
    return {
      tableData: [
        {
          id: "1",
          name: "王小虎",
          status: "未开启"
        },
        {
          id: "2",
          name: "王小虎",
          status: "未开启"
        },
        {
          id: "3",
          name: "王小虎",
          status: "未开启"
        },
        {
          id: "4",
          name: "王小虎",
          status: "开启"
        },
        {
          id: "5",
          name: "王小虎",
          status: "未开启"
        },
        {
          id: "6",
          name: "王小虎",
          status: "开启"
        },
        {
          id: "7",
          name: "王小虎",
          status: "未开启"
        }
      ],
      search: {
        name: '',
        date: '',
        type: ['全部', '工作计划', '学习计划']
      },
      typeList: [
        { id: 0, name: "全部" },
        { id: 1, name: "工作计划" },
        { id: 2, name: "学习计划" },
      ],
    };
  },
  methods: {
    onReset() {
      this.planName = ''
      this.searchDate = ''
    },
    onSearch() {
      console.log('onSearch');
    }
  },
  created() {
    // 类型默认选中全部
    this.search.type = this.typeList[0].name
  },
};
</script>

<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true">
      <el-form-item label="流程名称" prop="roleName">
        <el-input placeholder="请输入流程名称" clearable size="small" style="width: 240px" />
      </el-form-item>
      <el-form-item label="案件类型" prop="status">
        <el-select placeholder="请选择" clearable size="small" style="width: 240px">
          <el-option value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  icon="el-icon-top" size="mini">上移</el-button>
        <el-button type="primary"  icon="el-icon-bottom" size="mini">下移</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" width="120">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="name" label="环节名称" width="120"></el-table-column>
      <el-table-column prop="test" label="环节按钮" ></el-table-column>
      <el-table-column prop="test" label="签批按钮" ></el-table-column>
      <el-table-column prop="test" label="url" ></el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
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
      ]
    };
  }
};
</script>
<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" >
      <el-form-item label="环节名称" prop="roleName">
        <el-input placeholder="请输入环节名称" clearable size="small" style="width: 240px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select placeholder="请选择" clearable size="small" style="width: 240px">
          <el-option />
        </el-select>
      </el-form-item>
      <el-form-item label="是否有效" prop="status">
        <el-select placeholder="请选择" clearable size="small" style="width: 240px">
          <el-option />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-s-operation" size="mini">详情</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-remove-outline" size="mini">未启用</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-loading" size="mini">启用</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-top" size="mini">上移</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-bottom" size="mini">下移</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </el-col>
    </el-row>

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
      <el-table-column prop="status" label="环节状态" width="120"></el-table-column>
      <el-table-column prop="test" label="环节按钮名称" ></el-table-column>
      <el-table-column prop="test" label="签批按钮" ></el-table-column>
      <el-table-column prop="test" label="环节按钮" ></el-table-column>
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
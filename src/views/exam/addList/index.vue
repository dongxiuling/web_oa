<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" >
      <el-form-item label="考试名称" prop="roleName">
        <el-input placeholder="请输入考试名称" clearable size="small" style="width: 240px" />
      </el-form-item>
      <el-form-item label="模块" prop="status">
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
    </el-row>

    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column label="序号" >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="name" label="考试名称" ></el-table-column>
      <el-table-column prop="start" label="开始时间" ></el-table-column>
      <el-table-column prop="end" label="结束时间" ></el-table-column>
      <el-table-column prop="model" label="模块" ></el-table-column>
      <el-table-column prop="time" label="时长" ></el-table-column>
      <el-table-column label="操作"  width="200" >
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-edit" 
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
          >修改</el-button>
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-search" 
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
          >查看</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
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
          start: "2020-1-1",
          end:"2020-2-1",
          model:"司法",
          time:"120分钟"
        },
        {
          id: "2",
          name: "王小虎",
          start: "2020-1-1",
          end:"2020-2-1",
          model:"司法",
          time:"120分钟"
        },
        {
          id: "3",
          name: "王小虎",
          start: "2020-1-1",
          end:"2020-2-1",
          model:"司法",
          time:"120分钟"
        },
        {
          id: "4",
          name: "王小虎",
          start: "2020-1-1",
          end:"2020-2-1",
          model:"司法",
          time:"120分钟"
        },
        {
          id: "5",
          name: "王小虎",
          start: "2020-1-1",
          end:"2020-2-1",
          model:"司法",
          time:"120分钟"
        },
        {
          id: "6",
          name: "王小虎",
          start: "2020-1-1",
          end:"2020-2-1",
          model:"司法",
          time:"120分钟"
        },
        {
          id: "7",
          name: "王小虎",
          start: "2020-1-1",
          end:"2020-2-1",
          model:"司法",
          time:"120分钟"
        }
      ]
    };
  },
  methods:{
   /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDept(row.deptId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>
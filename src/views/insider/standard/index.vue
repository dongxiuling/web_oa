<template>
  <div class="app-container">
    <el-table :data="list" v-loading="loading">
      <el-table-column type="index" label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="身份"></el-table-column>
      <el-table-column prop="num" label="在岗标准百分比"></el-table-column>

      <el-table-column label="操作" width="260" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editHandle(scope.row)"
            >修改标准</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="delHandle(scope.row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="
        () => {
          dialogVisible = false;
        }
      "
    >
      <span>确认删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDelHandle">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改在岗标准百分比"
      :visible.sync="updateDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="updateStandard"
        :model="updateStandard"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="身份名称" prop="name">
          <el-input
            disabled
            v-model="updateStandard.name"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="在岗标准百分比数值" prop="num">
          <el-input
            v-model="updateStandard.num"
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateHander('updateStandard')"
          >确 定</el-button
        >
        <el-button @click="updateDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { selectStandard, delOutType, updateStandard } from "@/api/insider";

export default {
  data() {
    return {
      list: [],
      loading: true,
      dialogVisible: false,
      id: null,
      updateDialogVisible: false,
      updateStandard: {},
      rules: {
        num: [
          { required: true, validator: this.checkNum, trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    handleUpdate() { },
    async getData() {
      const res = await selectStandard()
      // console.log(res);
      this.list = res.data;
      this.loading = false;
    },
    searchHandle() {
      this.getData();
    },
    editHandle(row) {
      this.updateDialogVisible = true
      this.updateStandard = row
    },
    delHandle({ id }) {
      this.dialogVisible = true
      this.id = id
    },
    async doDelHandle() {
      this.dialogVisible = false
      const res = await delOutType(this.id)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.getData()
    },
    handleClose() {
      this.updateDialogVisible = false
    },
    checkNum(rule, value, callback) {
      console.log(value, typeof value)
      if (!value) {
        return callback(new Error('标准百分比不能为空'))
      }
      if (isNaN(Number(value))) {
        return callback(new Error('请输入数字'))
      }
      if (parseInt(value) <= 0 || parseInt(value) > 100) {
        return callback(new Error('请输入0~100之前整数'))
      }
      this.updateStandard.num = parseInt(value)
      return callback()
    },
    updateHander(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await updateStandard(this.updateStandard)
          if (res && res.code === '200') {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.updateDialogVisible = false
            this.getData()
          } else {
            this.$message({
              message: '修改失败',
              type: 'error'
            })
            console.error(res)
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });

    },
  },
  created() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.page-box {
  text-align: right;
  margin-top: 20px;
}
.el-tag {
  cursor: pointer;
}
</style>
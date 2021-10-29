<template>
  <div class="app-container">
    <el-form ref="cate" :model="cate" :rules="rules" label-width="100px">
      <el-form-item label="分类名称" prop="cateName">
        <el-input v-model="cate.cateName" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="活动分类" prop="typeId">
        <el-select
          style="width: 400px"
          v-model="cate.typeId"
          placeholder="请选择活动分类"
        >
          <el-option
            v-for="item in typeData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="$route.params.id"
          type="primary"
          @click="updateHandle('cate')"
          >确定修改</el-button
        >
        <div v-else>
          <el-button type="primary" @click="submitForm('cate')">创建</el-button>
          <el-button @click="resetForm('cate')">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  saveCate,
  getCateById,
  updateCate
} from '@/api/activity'
export default {
  data() {
    return {
      cate: {
        cateName: '',
        typeId: ''
      },
      id: this.$route.query.id,
      typeData: [{
        id: 1,
        name: '按时间'
      }, {
        id: 2,
        name: '按数量'
      }],
      rules: {
        cateName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        typeId: [{ required: true, message: '请选择分类', trigger: 'blur' }],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addHandle();
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.$router.go(-1)
    },
    async addHandle() {
      // console.log(this.cate);
      const res = await saveCate(this.cate)
      if (res && res.code === '200') {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$router.push('/dragontiger/dragontigerCate')
      } else {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    async updateHandle() {
      const res = await updateCate(this.cate)
      // console.log(res);
      if (res && res.code === '200') {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.go(-1)
      } else {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
        console.error(res)
      }
    }
  },
  async mounted() {
    const { id } = this.$route.params
    if (id) { // 修改
      const res = await getCateById(id)
      console.log(res)
      if (res && res.code === '200') {
        this.cate = res.data
      }
    }
  }
};
</script>
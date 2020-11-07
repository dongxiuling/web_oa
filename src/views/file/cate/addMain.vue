<template>
  <div class="app-container">
    <el-form ref="cate" :model="cate" :rules="rules" label-width="100px">
      <el-form-item label="主分类名称" prop="name">
        <el-input v-model="cate.name" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$route.params.id" type="primary" @click="updateHandle('cate')">确定修改</el-button>
        <div v-else>
          <el-button type="primary" @click="submitForm('cate')">创建</el-button>
          <el-button @click="resetForm('cate')">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  saveFileCate,
  getCateById,
  updateCate
} from '@/api/file'
export default {
  data() {
    return {
      cate: {
        name: '',
      },
      id: this.$route.params.id,
      rules: {
        name: [{ required: true, message: '请输入主分类名称', trigger: 'blur' }],
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
      this.$refs[formName].resetFields();
    },
    async addHandle() {
      const res = await saveFileCate({
        ...this.cate, 
        parent: this.id
      })
      if (res && res.code === '200') {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$router.push('/file/filecate')
      } else {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    async updateHandle() {
      const res = await updateCate({
        ...this.cate
      })
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
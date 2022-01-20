<template>
  <div class="app-container">
    <el-form ref="cate" :model="cate" :rules="rules" label-width="120px">
      <el-form-item label="就餐单位名称" prop="name">
        <el-input v-model="cate.name" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$route.params.id" type="primary" @click="updateHandle('cate')">确定修改</el-button>
        <div v-else>
          <el-button type="primary" @click="submitForm('cate')">创建</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  saveUnit,
  getDiningUnit,
  updateUnit
} from '@/api/dining.js'
export default {
  data() {
    return {
      cate: {
        name: '',
      },
      id: this.$route.query.id,
      rules: {
        name: [{ required: true, message: '请输入就餐单位名称', trigger: 'blur' }],
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
      const res = await saveUnit(this.cate)
      if (res && res.code === '200') {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$router.push('/dining/diningUnitList')
      } else {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    async updateHandle() {
      const res = await updateUnit(this.cate)
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
      const res = await getDiningUnit({id})
      console.log(res)
      if (res && res.code === '200') {
        this.cate = res.data
      }
    }
  }
};
</script>
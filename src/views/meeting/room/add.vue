<template>
  <div class="app-container">
    <el-form ref="room" :model="room" :rules="rules" label-width="100px">
      <el-form-item label="会场号" prop="no">
        <el-input v-model="room.no" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="会场名称" prop="name">
        <el-input v-model="room.name" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="可容纳人数" prop="num">
        <el-input v-model="room.num" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="是否可用" prop="status">
        <el-radio v-model="room.status" :label=1>可用</el-radio>
        <el-radio v-model="room.status" :label=2>停用</el-radio>
      </el-form-item>
      <el-form-item label="备注" prop="content">
        <el-input type="textarea" style="width:400px" v-model="room.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="$route.params.id" type="primary" @click="updateHandle('room')">确定修改</el-button>
        <div v-else>
          <el-button type="primary" @click="submitForm('room')">创建</el-button>
          <el-button @click="resetForm('room')">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  addMeetingRoom,
  getRoomDetail,
  updateRoom
} from '@/api/meeting'
export default {
  data() {
    return {
      room: {
        no: '', // 会场号
        name: '', // 会场名称
        num: '', // 容纳人数
        status: 1, // 1可用 2停用
        remark: '', // 备注
      },
      id: this.$route.query.id,
      rules: {
        no: [{ required: true, message: '请输入会场号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入会场名称', trigger: 'blur' }],
        num: [{ required: true, message: '请输入可容纳人数', trigger: 'blur' }],
        status: [{ required: true }],
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
    // 添加会场
    async addHandle() {
      const res = await addMeetingRoom(this.room)
      if (res && res.code === '200') {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$router.push('/meeting/meetroom')
      } else {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    async updateHandle() {
      const res = await updateRoom(this.room)
      console.log(res);
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
      const res = await getRoomDetail(id)
      // console.log(res)
      if (res && res.code === '200') {
        this.room = res.data
      }
    }
  }
};
</script>
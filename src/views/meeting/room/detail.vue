<template>
  <div class="app-container">
    <el-form ref="room" :model="room" label-width="100px">
      <el-form-item label="会场号">
        <el-input disabled v-model="room.no" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="会场名称">
        <el-input disabled v-model="room.name" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="可容纳人数">
        <el-input disabled v-model="room.num" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="是否可用">
        <el-radio disabled v-model="room.status" :label="1">可用</el-radio>
        <el-radio disabled v-model="room.status" :label="2">停用</el-radio>
      </el-form-item>
      <el-form-item label="备注">
        <el-input disabled type="textarea" style="width:400px" v-model="room.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getRoomDetail
} from '@/api/meeting'
export default {
  data() {
    return {
      room: {}
    }
  },
  methods: {
    async getDetail() {
      const { id } = this.$route.params
      const res = await getRoomDetail(id)
      if (res && res.code === '200') {
        this.room = res.data
      } else {
        console.error(res);
      }
    }
  },
  mounted() {
    this.getDetail()
  }
}
</script>

<style>
</style>
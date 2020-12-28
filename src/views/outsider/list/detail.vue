<template>
  <el-main>
    <div class="main-content">
      <div
        class="app-container"
        v-loading.fullscreen.lock="fullscreenLoading"
        v-if="!fullscreenLoading"
      >
        <el-form
          ref="form"
          :model="outsider"
          label-width="100px"
          size="medium"
        >
          <el-form-item label="联系人：">{{ outsider.contacts }}</el-form-item>
          <el-form-item label="来访事由：">{{ outsider.title }}</el-form-item>
          <el-form-item label="来访时段"
            >{{ outsider.startTime }} 至 {{ outsider.endTime }}</el-form-item
          >
          <el-form-item label="来访人员：">
            <div
              class="out-item"
              v-for="(obj, index) in outsider.persons"
              :key="index"
            >
              姓名：{{
                obj.name
              }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机号：{{
                obj.tel
              }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;身份证号：{{
                obj.idCard
              }}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button
                @click="openTabWin(obj.url, 'view')"
                v-if="obj.url"
                icon="el-icon-view"
                size="small"
                type="primary"
                >查看附件</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="来访车辆：">
            <span
              class="out-item"
              v-for="(obj, index) in outsider.cars"
              :key="index"
              >{{ obj.carNum }}</span
            >
          </el-form-item>
          <el-form-item label="备注:">{{ outsider.remark }}</el-form-item>

          <el-form-item label="来访记录:">
            <div v-for="(item, index) in outsider.records" :key="index">
              <span v-if="item.type == 1">
                <el-tag type="danger">进入</el-tag>
              </span>
              <span v-if="item.type == 2">
                <el-tag type="success">离开</el-tag>
              </span>
              {{ item.time }}
            </div>
          </el-form-item>

          <el-form-item>
            <!-- <el-button type="primary" @click="$router.go(-1)">确定</el-button> -->
            <el-button type="primary" @click="$router.go(-1)">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-main>
</template>

<script>
import { fileSave, getFileById, updateFile, downLoadFile, readFile } from "@/api/file";
import { getOutsiderById } from "@/api/outsider.js";
export default {
  data() {
    return {
      id: null,
      fullscreenLoading: true,
    };
  },
  methods: {
    async getListDetail() {
      const res = await getOutsiderById(this.id);
      if (res.code === "200") {
        this.outsider = res.data;
        this.fullscreenLoading = false;
      }
    },
    async openTabWin(url, type) {
      // if (type == "view") {
      //   await readFile({ id: this.file.id })
      // } else if (type = "download") {
      //   await downLoadFile({ id: this.file.id })
      // }
      window.open(url, "_blank");
    },
  },
  mounted() {
    this.id = this.$route.params.id
    this.getListDetail();
  }
};
</script>

<style lang="scss" scoped>
.main-content {
  background: #fff;
  min-height: calc(100vh - 210px);
  padding: 20px;
  box-sizing: border-box;
}
.page-box {
  text-align: right;
  margin-top: 20px;
}
.out-item {
  margin: 0 10px;
}
</style>
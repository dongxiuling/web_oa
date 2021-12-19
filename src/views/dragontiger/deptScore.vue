<template>
  <el-main>
    <div class="main-content">
      <div class="app-container">
        <el-button
          type="primary"
          icon="el-icon-back"
          size="mini"
          @click="$router.go(-1)"
          >返回</el-button
        >
        <h2 class="title" v-if="activity">{{ activity.title }}连队龙虎榜</h2>
        <el-table :data="list" style="width: 100%" v-loading="loading">
          <el-table-column
            align="center"
            type="index"
            label="排名"
          ></el-table-column>
          <el-table-column property="avatar" label="照片" align="center">
            <template slot-scope="scope">
              <el-image
                v-if="scope.row.avatar"
                style="width: 60px; height: 60px"
                :src="scope.row.avatar"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="姓名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="deptName"
            label="所属连队"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="result1"
            label="引体向上/俯卧撑"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="result2"
            label="仰卧起坐"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="result3"
            label="30米×2蛇形跑"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="result4"
            label="3000米跑"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="score"
            label="总成绩"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="resultStr"
            label="级别"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <!-- v-if="scope.$index < 10" -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit-outline"
                @click="scoreHandle(scope.row)"
                >上传头像</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          title="上传头像"
          :visible.sync="dialogVisible"
          :destroy-on-close="true"
          width="30%"
          :before-close="
            () => {
              dialogVisible = false;
            }
          "
        >
          <Uploader
            v-on:getFile="getFileUrl(arguments)"
            style="width: 94%"
          ></Uploader>
          <!-- <el-button
        @click="openTabWin(item.url, 'view')"
        v-if="item.url"
        icon="el-icon-view"
        size="small"
        type="primary"
        >预览文件</el-button
      > -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doUpload">确 定</el-button>
          </span>
        </el-dialog>
        <div class="page-box">
          <el-pagination
            style="width: 100%"
            background
            layout="total, prev, pager, next"
            :total="total"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import { selectCate, selectDeptScore, saveScore, getActivityById } from "@/api/activity.js";
import Uploader from "@/components/Uploader";
import { getFileById } from "@/api/file";


export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      cateData: [],
      search: {
        title: "",
        cateId: 0,
      },
      total: 0, //分页总页数
      loading: true,
      dialogVisible: false,
      activityId: null,
      file: {
        title: "",
        url: "",
        readUrl: "",
        type: "regulatory_documents",
        name: ""
      },
      isChange: false,
      id: null,
      activity: null,
      imgAvatar: require('@/assets/image/avatar.jpeg'),
    };
  },
  components: {
    Uploader
  },
  methods: {
    async getData() {
      const res = await selectDeptScore({
        activityId: this.activityId,
      })
      if (res.code === '200' && res.data) {
        res.data.records.map((elem, index) => {

          if (index < 10) {
            if (elem.url) {
              elem.avatar = elem.url
            } else {
              elem.avatar = this.imgAvatar
            }
          } else {
            elem.avatar = ''
          }
          if (elem.item1) {
            elem.result1 = `${elem.score1}（${elem.item1}个）`
          } else {
            elem.result1 = 0
          }
          if (elem.item2) {
            elem.result2 = `${elem.score2}（${elem.item2}个）`
          } else {
            elem.result2 = 0
          }
          if (elem.item3) {
            const item3Arr = elem.item3.split('-')
            elem.result3 = `${elem.score3}（${item3Arr[0]}″${item3Arr[1]}）`
          } else {
            elem.result3 = 0
          }

          if (elem.item4) {
            const item4Arr = elem.item4.split('-')
            elem.result4 = `${elem.score4}（${item4Arr[0]}″${item4Arr[1]}）`
          } else {
            elem.result4 = 0
          }

          if (elem.flag == 0) {
            elem.resultStr = '不及格'
          } else {
            if (elem.score == 0) {
              elem.resultStr = '无成绩'
            } else if (elem.score > 0 && elem.score < 240) {
              elem.resultStr = '不及格'
            } else if (elem.score >= 240 && elem.score < 320) {
              elem.resultStr = '及格'
            } else if (elem.score >= 320 && elem.score < 360) {
              elem.resultStr = '良好'
            } else if (elem.score >= 360 && elem.score < 440) {
              elem.resultStr = '优秀'
            } else if (elem.score >= 440 && elem.score < 480) {
              elem.resultStr = '特3级'
            } else if (elem.score >= 480 && elem.score < 500) {
              elem.resultStr = '特2级'
            } else if (elem.score >= 500) {
              elem.resultStr = '特1级'
            }
          }

        })
        this.list = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      }
    },
    // 获取分类列表
    /* async getCateList() {
      const { code, data } = await selectCate({
        size: 1000,
      })
      if (code === '200' && data.records) {
        this.cateData = data.records;
        this.cateData.unshift({ id: 0, cateName: "全部分类" });
      }
    }, */
    searchHandle() {
      this.getData();
    },
    reSetHandle() {
      this.search.title = "";
      this.search.cateId = 0;
      this.getData();
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.getData();
    },
    scoreHandle({ id }) {
      this.id = id
      this.dialogVisible = true

    },
    deptScore({ id }) {
      this.$router.push(`/dragontigers/deptScore/${id}`)
    },
    async doUpload() {
      this.dialogVisible = false
      this.list.map(item => {
        if (item.id == this.id) {
          item.url = this.file.url
        }
      })
      const res = await saveScore(this.list)
      if (res && res.code === '200') {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getData()
      } else {
        this.$message({
          message: '保存失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    getFileById(id) {
      getFileById({ id }).then(res => {
        this.file = res.data;
      });
    },
    getFileUrl(args) {
      this.file.url = args[1];
      this.file.readUrl = args[2];
      this.file.name = args[0];
      this.isChange = true;
    },
    async getActivity() {
      const res = await getActivityById(this.activityId)
      if (res && res.code === '200') {
        this.cateData.map(item => {
          if (res.data.cateId == item.id) {
            res.data.type = item.cateName
          }
        })
        res.data.time = res.data.startTime + ' 至 ' + res.data.endTime
        this.activity = res.data
      }
    }
  },
  mounted() {
    const { id } = this.$route.params
    this.activityId = id

    this.getActivity()
    this.getData();
    // this.getCateList();
  },

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
.title {
  text-align: center;
  margin-bottom: 30px;
}
</style>

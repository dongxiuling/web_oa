<template>
  <div class="app-container">
    <el-form
      ref="worklist"
      :model="worklist"
      :rules="rules"
      label-width="160px"
    >
      <el-form-item label="工作阶段" prop="steps">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="stepDialogVisible = true"
          >添加步骤</el-button
        >
        <el-steps style="width: 600px" id="step-container">
          <el-step
            v-for="(item, index) in worklist.steps"
            :title="item.name"
            :key="index"
            status="finish"
            :description="item.finishTime"
          ></el-step>
        </el-steps>
      </el-form-item>

      <el-form-item label="工作名称" prop="name">
        <el-input
          v-model="worklist.name"
          style="width: 600px"
          placeholder="请输入工作名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="工作说明" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          placeholder="请输入工作说明"
          v-model="worklist.remark"
          style="width: 600px"
        ></el-input>
      </el-form-item>

      <el-form-item label="工作检查项" prop="content">
        <el-tabs type="border-card" style="width: 920px">
          <el-tab-pane label="普通检查项">
            <Uploader
              v-on:getFile="getFileUrlCommon(arguments)"
              :change="isChange"
              :name="worklist.nameCommon"
            ></Uploader>
            <el-button
              v-if="id"
              @click="openTabWin(worklist.commonFileUrl, 'download')"
              icon="el-icon-download"
              size="small"
              type="success"
              >下载文件</el-button
            >

            <!-- 文件预览 -->
            <el-table :data="commonTableData" fit stripe style="width: 100%">
              <el-table-column
                v-for="(item, index) in commonColumns"
                :key="index"
                :prop="item.enName"
                :label="item.cnName"
                width="180"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="特殊检查项">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addSpecial"
              >增加特殊检查项</el-button
            >
            <el-card
              v-for="(item, index) in specialArr"
              :key="index"
              class="special-card"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="删除该项"
                placement="top-end"
              >
                <el-button
                  type="info"
                  icon="el-icon-delete"
                  class="special-del"
                ></el-button>
              </el-tooltip>
              <Uploader
                v-on:getFile="getFileUrlSpecial(arguments, index)"
                :change="isChange"
                :name="worklist.nameSpecial"
                style="width: 95%"
              ></Uploader>
              <el-button
                v-if="id"
                @click="openTabWin(worklist.specialFileUrl, 'download')"
                icon="el-icon-download"
                size="small"
                type="success"
                >下载文件</el-button
              >
              <el-table
                :data="specialTable[index].specialTableData"
                fit
                stripe
                style="width: 100%"
              >
                <el-table-column
                  v-for="(sItem, sIndex) in specialTable[index].specialColumns"
                  :key="sIndex"
                  :prop="sItem.enName"
                  :label="sItem.cnName"
                >
                </el-table-column>
              </el-table>
              <el-tree
                :data="deptTree"
                show-checkbox
                node-key="id"
                :ref="'tree' + index"
                :props="defaultProps"
                @check="getCheckedNodes(index)"
                :default-checked-keys="specialUserIdsArr[index]"
                :filter-node-method="filterNode"
              ></el-tree>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="$route.query.id"
          type="primary"
          @click="updateHandle('worklist')"
          >确定修改</el-button
        >
        <el-button v-else type="primary" @click="submitForm('worklist')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('worklist')">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="添加步骤"
      :visible.sync="stepDialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form ref="step" :model="step" :rules="stepRules" label-width="110px">
        <el-form-item label="步骤名称" prop="name">
          <el-input
            v-model="step.name"
            style="width: 300px"
            placeholder="请输入步骤名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker
            v-model="step.finishTime"
            type="datetime"
            placeholder="请选择步骤完成时间"
            style="width: 300px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stepDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { fileSave, getFileById, updateFile, downLoadFile, readFile } from "@/api/file";
import { listUser, getTreeUser } from "@/api/system/user";
import Uploader from "@/components/Uploader";
import { dateFormat } from "@/utils/format";
import { saveInspect, filePreview } from '@/api/worklist'

export default {
  data() {
    return {
      deptTree: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      step: {
        name: '',
        finishTime: ''
      },
      worklist: {
        name: "",
        commonFileUrl: "",
        // specialFileUrl: "http://www.rr.cc",
        readUrlCommon: "",
        // readUrlSpecial: "http://www.rr.cc",
        // userIds: [],
        // type: "regulatory_documents",
        nameCommon: "",
        // nameSpecial: "",
        steps: []
      },
      isChange: false, //false添加 true修改
      id: this.$route.query.id,
      rules: {
        name: [{ required: true, message: "请输入工作名称", trigger: "blur" }],
        remark: [{ required: true, message: "请输入工作说明", trigger: "blur" }],
        steps: [{ required: true, message: "请添加工作步骤", trigger: "blur" }],
      },
      stepRules: {
        name: [{ required: true, message: "请输入步骤名称", trigger: "blur" }],
        finishTime: [{ required: true, message: "请输入步骤完成时间", trigger: "blur" }],
      },
      props: {
        label: "name",
        children: "zones"
      },
      stepDialogVisible: false, // 添加步骤dialog
      commonTableData: [],
      commonColumns: [],
      specialArr: [], // 特殊检查项的数组，里面每个对象是一个特殊检查项
      specialTable: [], // 保存特殊检查项表格数据的数组，里面每个对象包括tableData和columns
      specialUserIdsArr: [], // 特殊检查项用户组成的数组，里面每个成员也是个数组表示每个检查项的关联连队
      specialUrlArr: [], // 特殊检查项文件url组成的数组，里面每个成员是个string，表示每个检查项关联的文件url
    };
  },
  components: {
    Uploader
  },
  watch: {
    // filterText(val) {
    //   this.$refs.tree.filter(val);
    // }
  },
  methods: {
    //获取选中状态下的人员数据
    getCheckedNodes(index) {
      const userIds = []
      const treeRef = this.$refs[`tree${index}`]
      treeRef[0].getCheckedNodes(true).forEach(item => {
        if (item.id.toString().length > 4) {
          userIds.push(item.id)
        }
      });
      this.specialUserIdsArr.push(userIds)
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      getTreeUser().then(response => {
        this.deptTree = response.data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addHandle();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addHandle() {
      // 验证 是否上传文件
      if (this.specialUserIdsArr.length != this.specialUrlArr.length) {
        this.$message.error('请检查特殊检查项是否填写完整');
      } else {

        const specialTemp = []
        this.specialUrlArr.forEach((item, index) => {
          specialTemp.push({
            specialFileUrl: item.fileUrl,
            userIds: this.specialUserIdsArr[index]
          })
        })
        this.worklist.special = specialTemp
        console.log(this.worklist);
        // saveInspect(this.worklist).then(res => {
        //   this.$message({
        //     message: "添加成功",
        //     type: "success"
        //   });
        //   this.$router.push("/worklist/inspect");
        // });
      }
    },
    updateHandle() {
      updateFile({ ...this.worklist, type: "regulatory_documents" }).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.$router.push("/worklist/inspect");
      });
    },
    async getFileById(id) {
      const res = await getFileById({ id })
      this.worklist = res.data;
    },
    // 获取wFid和nFid
    async getFileUrlCommon(args) {
      this.worklist.commonFileUrl = args[1];
      this.worklist.readUrlCommon = args[2];
      this.worklist.nameCommon = args[0];
      this.isChangeCommon = true;

      const urlArr = this.worklist.commonFileUrl.split('/')
      const ip = urlArr[2].split(':')[0]
      const port = urlArr[2].split(':')[1]
      const fid = urlArr[3]
      const res = await filePreview({ ip, port, fid })
      if (res && res.code === '200') {
        const { columns, values } = JSON.parse(res.msg)
        this.commonColumns = columns
        this.commonTableData = values
      }
    },
    async getFileUrlSpecial(args, index) {
      this.specialUrlArr.push({
        fileUrl: args[1],
        isChangeSpecial: true
      })

      // this.worklist.specialFileUrl = args[1];
      // this.worklist.readUrlSpecial = args[2];
      // this.worklist.nameSpecial = args[0];
      // this.isChangeSpecial = true;

      const urlArr = args[1].split('/')
      const ip = urlArr[2].split(':')[0]
      const port = urlArr[2].split(':')[1]
      const fid = urlArr[3]
      const res = await filePreview({ ip, port, fid })
      if (res && res.code === '200') {
        const { columns, values } = JSON.parse(res.msg)
        // this.specialTable[index] = {
        //   specialColumns: columns,
        //   specialTableData: values
        // }
        Vue.set(this.specialTable, index, {
          specialColumns: columns,
          specialTableData: values
        })
        // this.specialColumns = columns
        // this.specialTableData = values
      }
    },
    // 下载或预览操作
    async openTabWin(url, type) {
      if (type == "view") {
        await readFile({ id: this.worklist.id })
      } else if (type = "download") {
        await downLoadFile({ id: this.worklist.id })
      }
      window.open(url, "_blank");
    },

    addStep() {
      this.worklist.steps.push({
        name: this.step.name,
        finishTime: dateFormat("YYYY-mm-dd HH:MM:SS", this.step.finishTime)
      })
      this.step = {
        name: '',
        finishTime: ''
      }
    },
    handleClose() {
      this.stepDialogVisible = false
      this.worklist.step = ''
    },
    addSpecial() {
      this.specialArr.push({})
      this.specialTable.push({
        specialColumns: [],
        specialTableData: []
      })
      // this.specialUserIdsArr.push([])
    }
  },
  created() {
    // 获取部门树形结构
    this.getDeptTreeselect();
    if (this.id) {
      this.getFileById(this.id);
      // 修改upload 状态 false添加 true修改
      this.isChange = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.special-card {
  margin-top: 10px;
  position: relative;
}

.special-del {
  margin: 10px;
  padding: 3px;
  width: 36px;
  height: 36px;
  font-size: 16px;
  position: absolute;
  top: 5px;
  right: 3px;
  z-index: 1;
}
</style>
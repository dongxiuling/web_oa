<template>
  <div id="banner-list">
    <el-tabs v-model="activeName" @tab-click="tabHandle(activeName)">
      <el-tab-pane label="单选题" name="1">
        <el-button type="primary" size="mini" id="banner-list-add" @click="showDialog('add', 1)">
          <i class="el-icon-plus"></i>
          添加单选题
        </el-button>

        <el-table :data="single"  style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <h3>题目详情</h3>
              <div v-html="row.title"></div>
            </template>
          </el-table-column>
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="题目" prop="title">
            <template slot-scope="{row}">
              <div v-html="row.title" style="height: 27px;"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="desc">
            <template slot-scope="scope">
              <el-button @click="change(scope.row, 'change', 1)" type="text" size="small">编辑</el-button>
              <el-button @click="delHandle(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="简答题" name="2">
        <el-button type="primary" size="mini" id="banner-list-add" @click="showDialog('add', 2)">
          <i class="el-icon-plus"></i>
          添加简答题
        </el-button>
        <el-table :data="essay"  style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <h3>题目详情</h3>
              <div v-html="row.title"></div>
            </template>
          </el-table-column>
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="题目" prop="title">
            <template slot-scope="{row}">
              <div v-html="row.title" style="height: 27px;"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="desc">
            <template slot-scope="scope">
              <el-button @click="change(scope.row, 'change', 2)" type="text" size="small">编辑</el-button>
              <el-button @click="delHandle(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="添加习题" :visible.sync="dialogVisible" width="70%">
      <el-form label-width="100px">
        <el-form-item label="题目">
          <el-input type="textarea" v-model="exer.title"></el-input>
        </el-form-item>
        <div v-if="status*1 == 1">
          <el-form-item label="A">
            <el-input type="textarea" v-model="exer.choiceA"></el-input>
          </el-form-item>
          <el-form-item label="B">
            <el-input type="textarea" v-model="exer.choiceB"></el-input>
          </el-form-item>
          <el-form-item label="C">
            <el-input type="textarea" v-model="exer.choiceC"></el-input>
          </el-form-item>
          <el-form-item label="D">
            <el-input type="textarea" v-model="exer.choiceD"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="tag=='add'" type="primary" @click="addHandle()">添 加</el-button>
        <el-button v-if="tag=='change'" type="primary" @click="editHandle()">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getQueList, addTest,delTest } from "@/api/question/index.js";
export default {
  data() {
    return {
      naireId: this.$route.query.naireId,
      status: 1, // 1 单选， 2问答题
      dialogVisible: false,
      listLoading: true,
      activeName: "1",
      single: [],
      essay: [],
      exer: {
        title: "",
        choiceA: "",
        choiceB: "",
        choiceC: "",
        choiceD: "",
      },
      tag: "add",
      exerId:0
    };
  },
  computed:{
    typeName(){
      let typeName = "";
      if (this.status == 1) {
        //判断单选题
        typeName = "single";
      } else if (this.status == 2) {
        //判断多选题
        typeName = "essay";
      } 
      return typeName;
    }
  },
  methods: {
    tabHandle(activeName){
        this.status = activeName;
        // this.getData();
    },
    getData() {
      getQueList({
        naireId:this.naireId
      })
      .then(res => {
        this.single = res.data.choiceQuestion;
        this.essay = res.data.essayQuestion;
        this.listLoading = false;
      })
      .catch(err => {
        this.listLoading = false;
      });
    },
    showDialog(tag, status) {
      this.resetData();
      this.tag = tag;
      this.status = status;
      this.dialogVisible = true;
    },
    // 修改习题
    change(data, tag, status) {
      this.resetData();
      this.tag = tag;
      this.status = status;
      for( let key in this.exer){
        this.exer[key] = data[key];
      }
      this.exerId = data.id;
      this.dialogVisible = true;
    },
    // 修改|添加重置数据
    resetData(){
        for(let key in this.exer){
          this.exer[key] = "";
        }
    },
    addHandle() {
      let params = { ...this.exer, naireId:this.naireId ,type:this.status};
      addTest(params).then(res => {
          this.dialogVisible = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.getData();
      });
    },
    editHandle(){
      addTest({ ...this.exer, naireId:this.naireId ,type:this.status,id:this.exerId}).then(res => {
          this.dialogVisible = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getData();
      });
    },
    delHandle(_data){
      this.$confirm('此操作将永久删除考试题且无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTest({
          id:_data.id
        }).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getData();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
#banner-list {
  margin-top: 30px;
  padding: 0 20px;

  #banner-list-add {
    float: right;
    margin-bottom: 20px;
  }
}
.page-box {
  text-align: right;
  margin-top: 20px;
}
</style>
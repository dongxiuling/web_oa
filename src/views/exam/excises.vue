<template>
  <div id="banner-list">
    <!-- <el-page-header @back="$router.back()" content="添加考试题"> -->
    <!-- </el-page-header> -->
    <!-- <el-divider></el-divider> -->
    <el-tabs v-model="activeName" @tab-click="tabHandle(activeName)">
      <el-tab-pane label="单选题" name="1">
        <el-button type="primary" size="mini" id="banner-list-add" @click="showDialog('add', 1)">
          <i class="el-icon-plus"></i>
          添加单选题
        </el-button>

        <el-table :data="single.exercises" v-loading="singleloading" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <h3>题目详情</h3>
              <div v-html="row.title"></div>
            </template>
          </el-table-column>
          <el-table-column label="序号" width="70px">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="题目" prop="title">
            <template slot-scope="{row}">
              <div v-html="row.title" style="height: 27px;"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="desc">
            <template slot-scope="scope">
              <el-button @click="change(scope.row, 'change', 1)" type="text" size="small">编辑</el-button>
              <el-button @click="delExer(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination
            style="width: 100%"
            background
            layout="total, prev, pager, next"
            :total="single.total"
            :current-page.sync="single.currentPage"
            :page-size="single.pageSize"
             @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane label="多选题" name="2">
        <el-button type="primary" size="mini" id="banner-list-add" @click="showDialog('add', 2)">
          <i class="el-icon-plus"></i>
          添加多选题
        </el-button>

        <el-table :data="multiple.exercises" v-loading="multipleloading" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <h3>题目详情</h3>
              <div v-html="row.title"></div>
            </template>
          </el-table-column>
          <el-table-column label="序号" width="70px">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="题目" prop="title">
            <template slot-scope="{row}">
              <div v-html="row.title" style="height: 27px;"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="desc">
            <template slot-scope="scope">
              <el-button @click="change(scope.row, 'change', 2)" type="text" size="small">编辑</el-button>
              <el-button @click="delExer(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination
            style="width: 100%"
            background
            layout="total, prev, pager, next"
            :total="multiple.total"
            :current-page.sync="multiple.currentPage"
            :page-size="multiple.pageSize"
             @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="判断题" name="3">
        <el-button type="primary" size="mini" id="banner-list-add" @click="showDialog('add', 3)">
          <i class="el-icon-plus"></i>
          添加判断题
        </el-button>
        <el-table :data="judge.exercises" v-loading="judgeloading" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <h3>题目详情</h3>
              <div v-html="row.title"></div>
            </template>
          </el-table-column>
          <el-table-column label="序号" width="70px">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="题目" prop="title">
            <template slot-scope="{row}">
              <div v-html="row.title" style="height: 27px;"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="desc">
            <template slot-scope="scope">
              <el-button @click="change(scope.row, 'change', 3)" type="text" size="small">编辑</el-button>
              <el-button @click="delExer(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination
            style="width: 100%"
            background
            layout="total, prev, pager, next"
            :total="judge.total"
            :current-page.sync="judge.currentPage"
            :page-size="judge.pageSize"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="简答题" name="4">
        <el-button
          type="primary"
          size="mini"
          id="banner-list-add"
          @click="showDialog('add', 4)"
        >
          <i class="el-icon-plus"></i>
          添加简答题
        </el-button>
        <el-table :data="essay.exercises" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="{ row }">
              <h3>题目详情</h3>
              <div v-html="row.title"></div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="ID" prop="id"></el-table-column> -->
          <el-table-column label="序号" width="70px">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="题目" prop="title">
            <template slot-scope="{ row }">
              <div v-html="row.title" style="height: 27px"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="desc">
            <template slot-scope="scope">
              <el-button
                @click="change(scope.row, 'change', 4)"
                type="text"
                size="small"
                >编辑</el-button
              >
              <el-button @click="delHandle(scope.row)" type="text" size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="编辑习题" :visible.sync="dialogVisible" width="70%">
      <el-form label-width="100px">
        <el-form-item label="题目">
          <el-input type="textarea" :rows="2" v-model="exer.title"></el-input>
          <!-- <quill-editor
            ref="text"
            v-model="data.title"
            class="myQuillEditor"
            :options="editorOption"
          />-->
        </el-form-item>
        <div v-if="status*1 == 1 || status*1 == 2">
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
        <div v-else-if="status*1 == 3">
          <el-form-item label="A">
            <el-input type="textarea" v-model="exer.choiceA" :disabled="true" ></el-input>
          </el-form-item>
          <el-form-item label="B">
            <el-input type="textarea" v-model="exer.choiceB" :disabled="true" ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="答案" v-if="status*1==1">
          <el-radio-group v-model="exer.answer">
            <el-radio label="A">A</el-radio>
            <el-radio label="B">B</el-radio>
            <el-radio label="C">C</el-radio>
            <el-radio label="D">D</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="答案" v-if="status*1==2">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="A">A</el-checkbox>
            <el-checkbox label="B">B</el-checkbox>
            <el-checkbox label="C">C</el-checkbox>
            <el-checkbox label="D">D</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="答案" v-if="status*1==3">
          <el-radio-group v-model="exer.answer">
             <el-radio label="A">A</el-radio>
             <el-radio label="B">B</el-radio>
          </el-radio-group>
        </el-form-item>
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
// import { quillEditor } from 'vue-quill-editor'
import { getExcisesList, addExam,delExer } from "@/api/exam.js";
export default {
  data() {
    return {
      categoryId: this.$route.query.cateId,
      status: 1, // 1 单选， 2多选  3判断
      dialogVisible: false,
      listLoading: true,
      activeName: "1",
      single: {
        exercises: [],
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      multiple: {
        exercises: [],
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      judge: {
        exercises: [],
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      exer: {
        title: "",
        choiceA: "",
        choiceB: "",
        choiceC: "",
        choiceD: "",
        answer: ""
      },
      essay: {
        exercises: [],
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      exerId:0, //题id
      checkList: [], //多選題列表
      tag: "add",
      singleloading:true,
      multipleloading:true,
      judgeloading:true
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
        typeName = "multiple";
      } else if (this.status == 3) {
        //判断判断题
        typeName = "judge";
      }else if (this.status == 4) {
        //判断简答题
        typeName = "essay";
      }
      return typeName;
    }
  },
  methods: {
    tabHandle(activeName){
        this.status = activeName;
        this.getData();
    },
    getData() {
      //获取当前类别下的当前页 
      let current = this[this.typeName].currentPage;
      let size = this[this.typeName].pageSize;
      getExcisesList({
        categoryId: this.categoryId,
        type:this.status,
        current,
        size
      })
      .then(res => {
        console.log(res);
        this[this.typeName].exercises = res.data.records;
        this[this.typeName].total = res.data.total;
        this[this.typeName+"loading"] = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
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
      if (status * 1 === 2) {
        this.checkList = data.answer.split(',')
      }
      this.dialogVisible = true;
    },
    // 修改|添加重置数据
    resetData(){
        for(let key in this.exer){
          this.exer[key] = "";
          this.checkList=[];
        }
        if(this.status == 3){
          this.exer.choiceA = "正确";
          this.exer.choiceB = "错误";
        }
    },
    addHandle() {
      if (this.status == 2 ) {
        this.exer.answer = this.checkList.join(",");
      }
      let params = { ...this.exer, categoryId:this.categoryId ,type:this.status};
      console.log(params);

      addExam(params).then(res => {
          this.dialogVisible = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.getData(this.status);
      });
    },
    editHandle(){
      if (this.status == 2 ) {
        this.exer.answer = this.checkList.join(",");
      }
      let params = { ...this.exer, categoryId:this.categoryId ,type:this.status,id:this.exerId};

      addExam(params).then(res => {
          this.dialogVisible = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getData(this.status);
      });
    },
    delExer(_data){
      this.$confirm('此操作将永久删除考试题且无法恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delExer({
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
    },
    handleCurrentChange(value){
      this[this.typeName].currentPage = value;
      this.getData();
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
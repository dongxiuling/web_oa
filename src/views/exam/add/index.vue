<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="考试名称">
        <el-input v-model="form.name" style="width:300px" ></el-input>
      </el-form-item>
      <el-form-item label="考试类目">
        <el-select v-model="form.region" placeholder="请选择">
          <el-option label="区域一" value="司法"></el-option>
          <el-option label="区域二" value="政治"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试时长">
        <el-input v-model="form.time" style="width:200px" >
             <span slot="suffix">分钟</span>
        </el-input>
      </el-form-item>
      <el-form-item label="考试时间">
        <el-date-picker
          v-model="form.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="单选题">
        <el-input v-model="form.single" style="width:130px"  type="number" size="small">
             <template slot="append">个</template>
        </el-input>
        <el-input v-model="form.singleScore" style="width:200px"  type="number" size="small" >
            <template slot="prepend">每题</template>
            <template slot="append">分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="多选题">
        <el-input v-model="form.single" style="width:130px"  type="number" size="small">
            <template slot="append">个</template>
        </el-input>
        <el-input v-model="form.singleScore" style="width:200px" type="number" size="small" >
            <template slot="prepend">每题</template>
            <template slot="append">分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="判断题">
        <el-input v-model="form.single" style="width:130px"  type="number" size="small">
             <template slot="append">个</template>
        </el-input>
        <el-input v-model="form.singleScore" style="width:200px"  type="number" size="small">
            <template slot="prepend">每题</template>
            <template slot="append">分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="参考人员">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
         form: {
          name: '',
          time:120,
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
      props: {
        label: "name",
        children: "zones"
      },
      count: 1,
      num: 1
    };
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    handleNodeClick(data) {
      console.log(data);
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: "region1" }, { name: "region2" }]);
      }
      if (node.level > 3) return resolve([]);

      var hasChild;
      if (node.data.name === "region1") {
        hasChild = true;
      } else if (node.data.name === "region2") {
        hasChild = false;
      } else {
        hasChild = Math.random() > 0.5;
      }

      setTimeout(() => {
        var data;
        if (hasChild) {
          data = [
            {
              name: "zone" + this.count++
            },
            {
              name: "zone" + this.count++
            }
          ];
        } else {
          data = [];
        }

        resolve(data);
      }, 500);
    }
  }
};
</script>
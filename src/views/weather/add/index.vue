<template>
  <div class="app-container">
    <el-form ref="weather" :model="weather" :rules="rules" label-width="120px">
      <el-form-item label="时间" prop="time">
        <el-date-picker
          v-model="weather.time"
          type="datetime"
          placeholder="请选择时间"
          style="width: 400px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="能见度" prop="visibility">
        <el-input v-model="weather.visibility" style="width: 400px"></el-input>
      </el-form-item>
      <!-- <el-form-item label="天气情况" prop="conditions">
        <el-input v-model="weather.conditions" style="width: 400px"></el-input>
      </el-form-item> -->
      <el-form-item label="天气情况" prop="conditions">
        <el-select v-model="weather.conditions" placeholder="请选择天气情况" style="width: 400px">
          <el-option
            v-for="item in info"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="温度" prop="temp">
        <el-input v-model="weather.temp" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="风力" prop="windPower">
        <el-input v-model="weather.windPower" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="风向" prop="windDectition">
        <el-input
          v-model="weather.windDectition"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item label="重要天气提醒" prop="important">
        <el-input v-model="weather.important" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          style="width: 400px"
          v-model="weather.remark"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <!-- <el-button
          v-if="$route.params.id"
          type="primary"
          @click="updateHandle('weather')"
          >确定修改</el-button
        > -->
        <div>
          <el-button type="primary" @click="submitForm('weather')"
            >创建</el-button
          >
          <el-button @click="resetForm('weather')">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  saveWeather,getWeatherById
} from '@/api/weather'
import { dateFormat } from "@/utils/format";
export default {
  data() {
    return {
      weather: {
        visibility: '',
        conditions: '',
        temp: '',
        windPower: '',
        windDectition: '',
        important: '',
        remark: '',
        time: ''
      },
      info: [
        {
          id: '晴',
          name: '晴'
        },{
          id: '多云',
          name: '多云'
        },{
          id: '少云',
          name: '少云'
        },{
          id: '晴间多云',
          name: '晴间多云'
        },{
          id: '阴',
          name: '阴'
        },{
          id: '阵雨',
          name: '阵雨'
        },{
          id: '雷阵雨',
          name: '雷阵雨'
        },{
          id: '强雷阵雨',
          name: '强雷阵雨'
        },{
          id: '雷阵雨伴有冰雹',
          name: '雷阵雨伴有冰雹'
        },{
          id: '小雨',
          name: '小雨'
        },{
          id: '中雨',
          name: '中雨'
        },{
          id: '大雨',
          name: '大雨'
        },{
          id: '极端降雨',
          name: '极端降雨'
        },{
          id: '毛毛雨/细雨',
          name: '毛毛雨/细雨'
        },{
          id: '暴雨',
          name: '暴雨'
        },{
          id: '大暴雨',
          name: '大暴雨'
        },{
          id: '特大暴雨',
          name: '特大暴雨'
        },{
          id: '冻雨',
          name: '冻雨'
        },{
          id: '小到中雨',
          name: '小到中雨'
        },{
          id: '中到大雨',
          name: '中到大雨'
        },{
          id: '大到暴雨',
          name: '大到暴雨'
        },{
          id: '暴雨到大暴雨',
          name: '暴雨到大暴雨'
        },{
          id: '大暴雨到特大暴雨',
          name: '大暴雨到特大暴雨'
        },{
          id: '雨',
          name: '雨'
        },{
          id: '强阵雨',
          name: '强阵雨'
        },{
          id: '小雪',
          name: '小雪'
        },{
          id: '中雪',
          name: '中雪'
        },{
          id: '大雪',
          name: '大雪'
        },{
          id: '暴雪',
          name: '暴雪'
        },{
          id: '雨夹雪',
          name: '雨夹雪'
        },{
          id: '雨雪天气',
          name: '雨雪天气'
        },{
          id: '阵雨夹雪',
          name: '阵雨夹雪'
        },{
          id: '阵雪',
          name: '阵雪'
        },{
          id: '小到中雪',
          name: '小到中雪'
        },{
          id: '中到大雪',
          name: '中到大雪'
        },{
          id: '大到暴雪',
          name: '大到暴雪'
        },{
          id: '雪',
          name: '雪'
        },{
          id: '薄雾',
          name: '薄雾'
        },{
          id: '雾',
          name: '雾'
        },{
          id: '霾',
          name: '霾'
        },{
          id: '扬沙',
          name: '扬沙'
        },{
          id: '浮尘',
          name: '浮尘'
        },{
          id: '沙尘暴',
          name: '沙尘暴'
        },{
          id: '强沙尘暴',
          name: '强沙尘暴'
        },{
          id: '浓雾',
          name: '浓雾'
        },{
          id: '强浓雾',
          name: '强浓雾'
        },{
          id: '中度霾',
          name: '中度霾'
        },{
          id: '重度霾',
          name: '重度霾'
        },{
          id: '严重霾',
          name: '严重霾'
        },{
          id: '大雾',
          name: '大雾'
        },{
          id: '特强浓雾',
          name: '特强浓雾'
        },
      ],
      id: this.$route.query.id,
      rules: {
        time: [{ required: true, message: '请选择日期', trigger: 'change' }],
        /* visibility: [{ required: true, message: '请输入能见度', trigger: 'blur' }],
        conditions: [{ required: true, message: '请输入天气情况', trigger: 'blur' }],
        temp: [{ required: true, message: '请输入温度', trigger: 'blur' }],
        windPower: [{ required: true, message: '请输入风力', trigger: 'blur' }],
        windDectition: [{ required: true, message: '请输入风向', trigger: 'blur' }] */
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
      this.weather.time = dateFormat("YYYY-mm-dd HH:MM:SS", new Date(this.weather.time))
      const res = await saveWeather(this.weather)
      if (res && res.code === '200') {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$router.push('/weather/weatherlist')
      } else {
        this.$message({
          message: '添加失败',
          type: 'error'
        })
        console.error(res)
      }
    },
    // async updateHandle() {
    //   const res = await updateRoom(this.weather)
    // //   console.log(res);
    //   if (res && res.code === '200') {
    //     this.$message({
    //       message: '修改成功',
    //       type: 'success'
    //     })
    //     this.$router.go(-1)
    //   } else {
    //     this.$message({
    //       message: '修改失败',
    //       type: 'error'
    //     })
    //     console.error(res)
    //   }
    // }
  },
  async mounted() {
    const { id } = this.$route.query
    if (id) { // 修改
      const res = await getWeatherById(id)
      if (res && res.code === '200') {
        this.weather = res.data
      }
    }
  }
};
</script>
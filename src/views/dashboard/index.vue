<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">
      用户类型:
      <span v-if="userRole === 'admin'"> 超级管理员 </span>
      <span v-else-if="userRole === 'editor'"> 普通管理员 </span>
      <span v-else-if="userRole === 'user'"> 普通用户 </span>
      <span v-else>未知用户</span>
    </div> -->
    <el-row class="stats-panel" :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix ">
            <span>用户数量</span>
          </div>
          <i class="el-icon-user" />
          <div v-if="userCounts" class="text item-text">
            <countTo :start-val="startVal" :end-val="userCounts" :duration="3000" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix ">
            <span>文章数量</span>
          </div>
          <i class="el-icon-document" />
          <div v-if="articleCounts" class="text item-text">
            <countTo :start-val="startVal" :end-val="articleCounts" :duration="3000" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix ">
            <span>事件数量</span>
          </div>
          <i class="el-icon-c-scale-to-original" />
          <div v-if="eventCounts" class="text item-text">
            <countTo :start-val="startVal" :end-val="eventCounts" :duration="3000" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix ">
            <span>措施数量</span>
          </div>
          <svg-icon icon-class="response" />
          <div v-if="responseCounts" class="text item-text">
            <countTo :start-val="startVal" :end-val="responseCounts" :duration="3000" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="always" class="my-box-card">
          <div slot="header" class="clearfix header-center">
            <span>灾害事件统计</span>
          </div>
          <div ref="lineChart" style="width: 200; height: 400px;" />
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="always" class="my-box-card">
          <div slot="header" class="clearfix header-center">
            <span>文章统计</span>
          </div>
          <div ref="pieChart" style="width: 100%; height: 400px;" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
import { getUserCounts } from '@/api/user'
import { getArticleCounts, getCategoryCounts } from '@/api/article'
import { getEventCounts, getEventWeek } from '@/api/event'
import { getResponseCounts } from '@/api/response'
import countTo from 'vue-count-to'
export default {
  name: 'Dashboard',
  components: {
    countTo
  },
  data() {
    return {
      startVal: 0,
      userCounts: null,
      articleCounts: null,
      eventCounts: null,
      responseCounts: null,
      categoryCounts: [],
      eventWeekVoList: []
      // dataArray: []
    }
  },
  computed: {
    ...mapGetters([
      'userName',
      'userRole'
    ])
  },
  mounted() {
    this.getUserCounts()
    this.getArticleCounts()
    this.getEventCounts()
    this.getResponseCounts()
    this.getCategoryCounts().then(() => {
      this.initPieChart()
    })
    this.getEventWeek().then(() => {
      this.initLineChart()
    })
    // this.initLineChart()
    // this.initPieChart()
  },
  methods: {
    getUserCounts() {
      return getUserCounts().then((response) => {
        this.userCounts = response.data.userCounts.total_users
      })
    },
    getArticleCounts() {
      return getArticleCounts().then((response) => {
        this.articleCounts = response.data.articleCounts.total_articles
      })
    },
    getEventCounts() {
      return getEventCounts().then((response) => {
        this.eventCounts = response.data.eventCounts.total_events
      })
    },
    getResponseCounts() {
      return getResponseCounts().then((response) => {
        this.responseCounts = response.data.responseCounts.total_responses
      })
    },
    getCategoryCounts() {
      return getCategoryCounts().then((response) => {
        this.categoryCounts = response.data.categoryCounts
        // this.dataArray = this.categoryCounts.map(item => ({
        //   value: item.articleCount,
        //   name: item.categoryName
        // }))
      })
    },
    getEventWeek() {
      return getEventWeek().then((response) => {
        this.eventWeekVoList = response.data.eventWeekVoList
      })
    },
    initLineChart() {
      const lineChart = echarts.init(this.$refs.lineChart)
      const option = {
        xAxis: {
          type: 'category',
          // data: ['2001', '2004', '2007', '2010', '2013', '2016', '2019', '2022']
          boundaryGap: false,
          data: this.eventWeekVoList.map(item => item.weekDay)
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['事件数量']
        },
        series: [
          {
            data: this.eventWeekVoList.map(item => item.totalReads),
            type: 'line',
            smooth: true,
            color: '#409EFF',
            lineStyle: {
              color: '#409EFF'
            }
          }
        ]
      }
      lineChart.setOption(option)
    },
    initPieChart() {
      const pieChart = echarts.init(this.$refs.pieChart)
      const option = {
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            type: 'pie',
            radius: [10, 140],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            // data: [
            //   { value: 40, name: '定义性科普文章' },
            //   { value: 38, name: '解释性科普文章' },
            //   { value: 32, name: '描述性科普文章' },
            //   { value: 30, name: '论述性科普文章' },
            //   { value: 28, name: '新闻性科普文章' },
            //   { value: 26, name: '评论性科普文章' }
            // ]
            data: this.categoryCounts.map(item => ({
              value: item.articleCount,
              name: item.categoryName
            }))
          }
        ]
      }
      pieChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.stats-panel {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #f4f4f4;
}

.box-card {
  width: 100%;
  box-shadow: var(--shadow);
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 20px;
}

.item-text {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  margin-top: 10px;
}

.header-center {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中（如果需要的话）*/
}

</style>

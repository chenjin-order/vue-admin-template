<template>
  <div id="eventPage-container">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-table :data="eventTableData" border style="width: 100%;border-radius: 10px">
          <el-table-column label="灾害事件图文" width="873px">
            <template slot-scope="scope">
              <el-card class="card-in-table" shadow="always" style="border-radius: 10px" @click.native.prevent="goToEventDetail(scope.row)">
                <div slot="header" class="clearfix">
                  <el-row :gutter="10">
                    <el-col :span="24"><span>{{ scope.row.eventName }}</span></el-col>
                  </el-row>
                </div>
                <el-row :gutter="30">
                  <el-col :span="6">
                    <el-image :src="scope.row.eventImageUrl" lazy />
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col :span="24"><div class="limited-content" v-html="scope.row.eventDescription" /></el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24"><el-button type="text">{{ scope.row.typeName }}</el-button></el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="18"><span>{{ scope.row.eventSource }}</span></el-col>
                      <el-col :span="6">{{ scope.row.eventEndDate }}</el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-card>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="isShow"
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          :current-page="currentPage"
          @current-change="changePage"
        />
      </el-col>
      <el-col :span="10">
        <el-card style="border-radius: 20px">
          <div slot="header" class="clearfix">
            <span>灾害事件类型统计</span>
          </div>
          <div ref="chart" style="width: 100%; height: 400px;" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getEventPageInfo, getEventTypeCount } from '@/api/event'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      eventTableData: [],
      eventHeatTableData: [],
      currentPage: 1,
      total: 1,
      pageSize: 1,
      isShow: false,
      chart: null,
      chartData: [],
      eventTypeVoList: []
    }
  },
  computed: {
    articlesWithRank() {
      return this.eventHeatTableData.map((event, index) => ({
        ...event,
        eventRank: this.oOrdinal(index + 1)
      }))
    }
  },
  watch: {
    currentPage(newVal) {
      this.changePage(newVal)
    },
    mounted() {
      this.changePage(this.currentPage)
    }
  },
  mounted() {
    // this.initChart()
    this.getEventTypeCount().then(() => {
      this.initChart()
    })
  },
  created: function() {
    getEventPageInfo().then((response) => {
      this.eventTableData = response.data.items.records

      this.total = response.data.items.total

      this.pageSize = response.data.items.size

      this.isShow = true
    })
  },
  methods: {
    changePage(articlePageNum) {
      if (articlePageNum) {
        this.currentPage = articlePageNum
      }
      getEventPageInfo(this.currentPage, this.queryKeyword).then((response) => {
        this.eventTableData = response.data.items.records
      })
    },
    getEventTypeCount() {
      return getEventTypeCount().then((response) => {
        this.eventTypeVoList = response.data.eventTypeVoList
      })
    },
    initChart() {
      const Chart = echarts.init(this.$refs.chart)
      const option = {
        xAxis: {
          type: 'category',
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          data: this.eventTypeVoList.map(item => item.typeName)
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          // data: [120, 200, 150, 80, 70, 110, 130],
          data: this.eventTypeVoList.map(item => item.numEvents),
          type: 'bar',
          itemStyle: {
            color: '#409EFF'
          },
          barWidth: '50'
        }]
      }
      Chart.setOption(option)
    },
    goToEventDetail(event) {
      this.$router.push(`/eventPage/detail/` + event.eventId)
    }
  }
}
</script>

<style scoped>
.card-in-table {
  /* 根据需要调整卡片在表格中的样式 */
  margin: 0;
  border-radius: 0;
  box-shadow: none;
}
.float-right {
  float: right;
}
.limited-content {
  max-height: 200px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
.limited-content::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0),rgba(255,255,255,1) 50%);
  pointer-events: none;
}
.limited-title {
  max-height: 50px;
  /* 确保内容不会换行，这样才能正确显示省略号 */
  white-space: nowrap;
  /* 隐藏溢出的内容 */
  overflow: hidden;
  /* 在溢出的内容处显示省略号 */
  text-overflow: ellipsis;
}
</style>

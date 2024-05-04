<template>
  <div id="articleDetail-container">
    <el-card>
      <div v-if="eventDetailVo">
        <el-row>
          <el-col :span="24">
            <h2>{{ eventDetailVo.eventName }}</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p>地点: {{ eventDetailVo.eventLocation }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p>开始日期: {{ eventDetailVo.eventStartDate }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p v-if="eventDetailVo.eventEndDate">结束日期: {{ eventDetailVo.eventEndDate }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p>严重程度: {{ getSeverityLevelText(eventDetailVo.eventSeverityLevel) }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="eventDetailDescription" v-html="eventDetailVo.eventDescription" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" :offset="7">
            <el-image class="eventDetailImage" :src="eventDetailVo.eventImageUrl" lazy />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h3>应对措施</h3>
            <el-table :data="responseDetailVo" style="width: 100%">
              <el-table-column prop="responseDetails" label="">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;"> {{ scope.row.responseDetails }} </span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getEventDetailById } from '@/api/event'
import { getResponseDetail } from '@/api/response'
export default {
  name: 'EventDetail',

  data() {
    return {
      eventDetailVo: [],
      responseDetailVo: []
    }
  },

  mounted() {

  },
  created() {
    if (this.$route.params.id) {
      const id = this.$route.params.id
      getEventDetailById(id).then(res => {
        this.eventDetailVo = res.data.eventDetailVo
      })
      getResponseDetail(id).then(res => {
        this.responseDetailVo = res.data.responseDetailVo
      })
    }
  },
  methods: {
    getSeverityLevelText(severityLevel) {
      // 创建一个映射对象来转换严重程度的值
      const severityLevelMap = {
        low: '低',
        medium: '中',
        high: '高'
      }
      // 返回转换后的文本，如果找不到对应的值则返回原始值
      return severityLevelMap[severityLevel] || severityLevel
    }
  }
}
</script>

<style scoped>
.eventDetailImage{
  margin: 0;
  padding: 0;
  width: 640px;
  height: 360px;
}
.eventDetailDescription{
  margin-bottom: 20px;
}
</style>

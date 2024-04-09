<template>
  <div class="card-container">
    <el-card v-for="(eventType, index) in eventTypes" :key="index" class="card-item">
      <div slot="header" class="card-header">
        <span class="card-title">{{ eventType.typeName }}</span>
      </div>
      <div class="card-content">
        <p>{{ eventType.typeDescription }}</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getEventTypes } from '@/api/event'

export default {
  data() {
    return {
      eventTypes: [

      ]
    }
  },
  created: function() {
    getEventTypes().then((response) => {
      this.eventTypes = response.data.items
      console.log(this.eventTypes)
    })
  }
}
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.card-item {
  width: 450px;
  margin-bottom: 20px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
}

.card-content {
  padding: 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #606266;
}
</style>

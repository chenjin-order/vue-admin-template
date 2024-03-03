<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      用户类型:
      <span v-if="userRole === 'admin'"> 超级管理员 </span>
      <span v-else-if="userRole === 'editor'"> 普通管理员 </span>
      <span v-else-if="userRole === 'user'"> 普通用户 </span>
      <span v-else>未知用户</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'userName',
      'userRole'
    ])
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
</style>

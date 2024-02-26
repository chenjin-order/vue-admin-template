<template>
  <div class="app-container">
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column label="ID" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px;">{{ scope.row.userId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="名称" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px;">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="头像" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.userAvatar + '?imageView2/1/w/80/h/80'" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column label="头像" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userRole }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px;">{{ scope.row.userCreatedAt }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="changePage"
      v-if="isShow"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      >
    </el-pagination>
  </div>
</template>
<script>
import { userList } from '@/api/user.js'

export default ({
  data() {
    return {
      total: 1,
      pageSize: 1,
      isShow: false,
      tableData: []
    }
  },
  created: function() {
    userList().then((response) => {
      this.tableData = response.data.items.records

      this.total = response.data.items.total

      this.pageSize = response.data.items.size

      this.isShow = true
    })
  },
  methods: {
    changePage(pageNum) {
      userList(pageNum).then((response) => {
        this.tableData = response.data.items.records
      })
    }
  }
})
</script>
<style scoped>
.user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
</style>

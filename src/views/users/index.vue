<template>
  <div class="app-container">
    <el-table :data="tableData" border style="width: 100%;" :default-sort="{ prop: 'id', order: 'ascending'}">
      <el-table-column prop="id" label="ID" sortable align="center" width="158">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像" align="center" width="180">
        <template slot-scope="scope">
          <el-avatar shape="square" :size="80" :src="scope.row.userAvatar" />
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userRole }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px;">{{ scope.row.userCreatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="isShow"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
      @current-change="changePage"
    />
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

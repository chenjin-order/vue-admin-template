<template>
  <div class="app-container">
    <el-input v-model="queryKeyword" placeholder="请输入查询关键字" style="width: 200px;margin-right: 20px;" />
    <el-button :loading="loadingUserSearch" type="primary" style="width: 100px;" @click.native.prevent="userSearch">查询</el-button>
    <el-button :loading="loadingUserSearchAll" type="primary" style="width: 100px;" @click.native.prevent="userSearchAll">查询全部</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      height="550"
      style="width: 1415px;"
      :default-sort="{ prop: 'id', order: 'ascending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column prop="id" label="ID" sortable align="center" width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="密码" align="center" width="170">
        <template slot-scope="scope">
          <!-- <span style="margin-left: 10px;">{{ scope.row.userPassword }}</span> -->
          <span style="margin-left: 10px;">{{ maskPassword(scope.row.userPassword) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像" align="center" width="170">
        <template slot-scope="scope">
          <!-- <el-avatar shape="square" :size="80" :src="getFullImageUrl(scope.row.userAvatar)" /> -->
          <el-avatar shape="square" :size="80" :src="scope.row.userAvatar" />
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;">{{ scope.row.userRole }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="210">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px;">{{ scope.row.userCreatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="更新时间" align="center" width="210">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px;">{{ scope.row.userUpdatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="operate" label="操作" align="center" width="184">
        <template slot-scope="scope">
          <el-button
            :loading="loadingEditor"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            :loading="loadingDelete"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form ref="editorUserForm" :model="editorUserForm" :rules="editorUserRules" class="addUser-form" autocomplete="on" label-position="top">
        <el-form-item label="用户名" prop="userName">
          <el-input
            ref="userName"
            v-model="editorUserForm.userName"
            name="userName"
            type="text"
            prefix-icon="el-icon-user"
            autocomplete="off"
            placeholder="请输入用户名"
            tabindex="1"
            style="width: 60%;"
          />
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input
            :key="passwordType"
            ref="userPassword"
            v-model="editorUserForm.userPassword"
            :type="passwordType"
            prefix-icon="el-icon-key"
            autocomplete="off"
            placeholder="请输入密码"
            tabindex="2"
            style="width: 60%;"
          />
          <span class="show-pwd" style="" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'userPassword' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="头像" prop="userAvatar">
          <el-upload
            ref="userAvatar"
            v-model="editorUserForm.userAvatar"
            class="avatar-uploader"
            action="http://localhost:8080/users/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            name="userAvatar"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            ref="userEmail"
            v-model="editorUserForm.userEmail"
            type="text"
            prefix-icon="el-icon-message"
            autocomplete="off"
            placeholder="请输入电子邮箱"
            tabindex="3"
            style="width: 60%;"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input
            ref="userPhone"
            v-model="editorUserForm.userPhone"
            type="text"
            prefix-icon="el-icon-phone-outline"
            autocomplete="off"
            placeholder="请输入手机号"
            tabindex="4"
            style="width: 60%;"
          />
        </el-form-item>
        <el-form-item label="角色" prop="userRole">
          <el-select ref="userRole" v-model="editorUserForm.userRole" placeholder="请选择角色" tabindex="6">
            <el-option
              v-for="item in options"
              :key="item.userRole"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loadingEditorSubmit" type="primary" style="width: 100px;" @click.native.prevent="submitForm">提交</el-button>
          <el-button :loading="loadingEditorReset" style="width: 100px;" @click.native.prevent="resetForm">重置</el-button>
          <el-button :loading="loadingEditorCancel" @click="cancelEditor">取消编辑</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-pagination
      v-if="isShow"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
      :current-page="currentPage"
      @current-change="changePage"
    />
    <div class="bottom" style="display: flex;justify-content: flex-end;width: 99%;">
      <el-button
        :loading="loadingBatchDelete"
        type="danger"
        @click="handleBatchDelete"
      >批量删除</el-button>
    </div>
  </div>
</template>
<script>
import { userList } from '@/api/user.js'
import { validUserName, validUserEmail, validUserPhone } from '@/utils/validate'

export default ({
  data() {
    const validateUserName = (rule, value, callback) => {
      if (!validUserName(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validateUserEmail = (rule, value, callback) => {
      if (!validUserEmail(value)) {
        callback(new Error('请输入正确的电子邮箱'))
      } else {
        callback()
      }
    }
    const validateUserPhone = (rule, value, callback) => {
      if (!validUserPhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      queryKeyword: '',
      currentPage: 1,
      total: 1,
      pageSize: 1,
      isShow: false,
      loadingEditor: false,
      loadingEditorSubmit: false,
      loadingEditorReset: false,
      loadingEditorCancel: false,
      loadingDelete: false,
      loadingBatchDelete: false,
      loadingUserSearch: false,
      loadingUserSearchAll: false,
      tableData: [],
      multipleSelection: [],
      dialogFormVisible: false,
      editorUserForm: {
        userId: '',
        userName: '',
        userPassword: '',
        userAvatar: '',
        userEmail: '',
        userPhone: '',
        userRole: '',
        userUpdatedAt: ''
      },
      initialEditorUserForm: {
        userId: '',
        userName: '',
        userPassword: '',
        userAvatar: '',
        userEmail: '',
        userPhone: '',
        userRole: '',
        userUpdatedAt: ''
      },
      editorUserRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUserName }],
        userEmail: [{ required: true, trigger: 'blur', validator: validateUserEmail }],
        userPhone: [{ required: true, trigger: 'blur', validator: validateUserPhone }]
      },
      options: [{
        value: 'admin',
        label: '超级管理员'
      }, {
        value: 'editor',
        label: '普通管理员'
      }, {
        value: 'user',
        label: '普通用户'
      }
      ],
      imageUrl: '',
      passwordType: 'password',
      redirect: undefined
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
  created: function() {
    userList().then((response) => {
      // this.tableData = response.data.items.records
      // const isoString = this.tableData.userCreatedAt
      // this.tableData.userCreatedAt = new Date(this.tableData.userCreatedAt)
      const newUsers = response.data.items.records.map(users => {
        const newUser = { ...users }
        // //  ISO 字符串转换为 Date 对象
        // const date = new Date(newUser.userCreatedAt)
        // // 原生 JavaScript 方法进行格式化Date
        // newUser.userCreatedAt = this.formatDateWithSeconds(date)
        // // newUser.userCreatedAt = new Date(newUser.userCreatedAt)
        newUser.userCreatedAt = this.formatDateWithSeconds(new Date(newUser.userCreatedAt))
        newUser.userUpdatedAt = this.formatDateWithSeconds(new Date(newUser.userUpdatedAt))
        return newUser
      })
      this.tableData = newUsers

      this.total = response.data.items.total

      this.pageSize = response.data.items.size

      this.isShow = true
    })
  },
  methods: {
    // getFullImageUrl(relativePath) {
    //   const baseUrl = 'http://192.168.216.129:8080/'
    //   // 构建完整的图片 URL
    //   return baseUrl + relativePath
    // },
    formatDateWithSeconds(date) {
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      const hours = ('0' + date.getHours()).slice(-2)
      const minutes = ('0' + date.getMinutes()).slice(-2)
      const seconds = ('0' + date.getSeconds()).slice(-2)
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    userSearch() {
      this.loadingUserSearch = true
      if (this.queryKeyword) {
        userList(this.currentPage, this.queryKeyword).then((response) => {
          this.tableData = response.data.items.records
          this.total = response.data.items.total
          this.pageSize = response.data.items.size
        })
        this.$message({
          type: 'success',
          message: '查询成功!'
        })
        this.loadingUserSearch = false
      } else {
        this.loadingUserSearch = false
        this.$message({
          type: 'error',
          message: '查询条件不能为空'
        })
      }
    },
    userSearchAll() {
      this.loadingUserSearchAll = true
      userList().then((response) => {
        this.tableData = response.data.items.records
        this.total = response.data.items.total
        this.pageSize = response.data.items.size
        this.queryKeyword = ''
        this.currentPage = 1
        this.$message({
          type: 'success',
          message: '查询成功!'
        })
      }).finally(() => {
        this.loadingUserSearchAll = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changePage(userPageNum) {
      if (userPageNum) {
        this.currentPage = userPageNum
      }
      userList(this.currentPage, this.queryKeyword).then((response) => {
        this.tableData = response.data.items.records
      })
    },
    handleEdit(index, row) {
      this.editorUserForm = { ...row }
      this.imageUrl = row.userAvatar
      this.loadingEditor = true
      this.dialogFormVisible = true
      this.initialEditorUserForm = { ...this.editorUserForm }
    },
    handleDelete(index, row) {
      this.loadingDelete = true
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/deleteUser', row.userId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadingDelete = false
          this.changePage()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          this.loadingDelete = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.loadingDelete = false
      })
    },
    handleBatchDelete() {
      const userIdList = this.multipleSelection.map(item => item.userId)
      this.loadingBatchDelete = true
      if (userIdList.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选择要删除的用户!'
        })
        this.loadingBatchDelete = false
        return
      }
      this.$alert('此操作将永久删除用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadingBatchDelete = true
        this.$store.dispatch('user/deleteBatchUser', userIdList).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadingBatchDelete = false
          this.changePage()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          this.loadingBatchDelete = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.loadingBatchDelete = false
      })
    },
    getLocalISOTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要+1并补0
      const date = String(now.getDate()).padStart(2, '0') // 日期补0
      const hours = String(now.getHours()).padStart(2, '0') // 小时补0
      const minutes = String(now.getMinutes()).padStart(2, '0') // 分钟补0
      const seconds = String(now.getSeconds()).padStart(2, '0') // 秒补0
      return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}`
    },
    handleClose(done) {
      this.$confirm('确认关闭？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(_ => {
          done()
          this.$message({
            type: 'info',
            message: '已取消编辑'
          })
          this.loadingEditor = false
        })
        .catch(_ => {})
    },
    maskPassword(password) {
      return Array(this.fixedMaskLength).fill('••••••••••').join('')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.userPassword.focus()
      })
    },
    handleAvatarSuccess(res, file) {
      this.editorUserForm.userAvatar = file.response.data.userAvatar
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    submitForm() {
      this.loadingEditorSubmit = true
      this.$confirm('确认提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.editorUserForm.validate(valid => {
          if (valid) {
            this.editorUserForm.userUpdatedAt = this.getLocalISOTime()
            this.$store.dispatch('user/editorUser', this.editorUserForm).then(() => {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.loadingEditorSubmit = false
              this.dialogFormVisible = false
              this.loadingEditor = false
              this.changePage()
            }).catch(() => {
              this.$message.error('提交失败')
              this.loadingEditorSubmit = false
            })
          } else {
            this.$message.error('提交用户信息错误，请重新输入')
            this.loadingEditorSubmit = false
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
        this.loadingEditorSubmit = false
      })
    },
    resetForm() {
      this.loadingEditorReset = true
      this.$confirm('确定重置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.editorUserForm.resetFields()
        this.editorUserForm.userAvatar = ''
        this.imageUrl = this.initialEditorUserForm.userAvatar
        if (this.imageUrl && typeof URL !== 'undefined' && URL.revokeObjectURL) {
          URL.revokeObjectURL(this.imageUrl)
        }
        this.$message({
          type: 'success',
          message: '重置成功!'
        })
        this.loadingEditorReset = false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
        this.loadingEditorReset = false
      })
    },
    cancelEditor() {
      this.loadingEditorCancel = true
      this.$confirm('确定取消编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogFormVisible = false
        this.loadingEditor = false
        this.loadingEditorCancel = false
        this.$message({
          type: 'info',
          message: '已取消编辑'
        })
      }).catch(() => {
      })
    }
  }
})
</script>
<style scoped>

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
.user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
</style>

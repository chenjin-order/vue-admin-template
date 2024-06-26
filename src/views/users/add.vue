<template>
  <div class="app-container">
    <el-form ref="addUserForm" :model="addUserForm" :rules="addUserRules" class="addUser-form" autocomplete="on" label-position="top">
      <el-form-item label="用户名" prop="userName">
        <el-input
          ref="userName"
          v-model="addUserForm.userName"
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
          v-model="addUserForm.userPassword"
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
          v-model="addUserForm.userAvatar"
          class="avatar-uploader"
          action="http://localhost:8080/upload/uploadUserAvatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          name="userAvatar"
        >
          <img v-if="imageUrl" :src="imageUrl" class="userAvatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="邮箱" prop="userEmail">
        <el-input
          ref="userEmail"
          v-model="addUserForm.userEmail"
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
          v-model="addUserForm.userPhone"
          type="text"
          prefix-icon="el-icon-phone-outline"
          autocomplete="off"
          placeholder="请输入手机号"
          tabindex="4"
          style="width: 60%;"
        />
      </el-form-item>
      <el-form-item label="角色" prop="userRole">
        <el-select ref="userRole" v-model="addUserForm.userRole" placeholder="请选择角色" tabindex="6">
          <el-option
            v-for="item in options"
            :key="item.userRole"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width: 100px;" @click.native.prevent="submitForm">提交</el-button>
        <el-button :loading="loadingReset" style="width: 100px;" @click.native.prevent="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validUserName, validUserEmail, validUserPhone } from '@/utils/validate'

export default {
  name: 'AddUser',
  data() {
    const validateUserName = (rule, value, callback) => {
      if (!validUserName(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6个字符'))
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
      addUserForm: {
        userName: '',
        userPassword: '',
        userAvatar: '',
        userEmail: '',
        userPhone: '',
        userRole: '',
        userCreatedAt: ''
      },
      addUserRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUserName }],
        userPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
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
      loading: false,
      loadingReset: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  methods: {
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
      this.addUserForm.userAvatar = file.response.data.userAvatar
      this.imageUrl = URL.createObjectURL(file.raw)
      // this.imageUrl = 'http://192.168.216.129:8080/' + file.response.data.userAvatar
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPEG或JRG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    submitForm() {
      this.loading = true
      this.$confirm('确定提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.addUserForm.validate(valid => {
          if (valid) {
            this.addUserForm.userCreatedAt = this.getLocalISOTime()
            this.$store.dispatch('user/addUser', this.addUserForm).then(() => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message.error('提交用户信息错误，请重新输入')
            this.loading = false
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
        this.loading = false
      })
    },
    resetForm() {
      this.loadingReset = true
      this.$confirm('确定重置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.addUserForm.resetFields()
        this.addUserForm.userAvatar = ''
        this.imageUrl = ''
        if (this.imageUrl && typeof URL !== 'undefined' && URL.revokeObjectURL) {
          URL.revokeObjectURL(this.imageUrl)
        }
        this.$message({
          type: 'success',
          message: '重置成功!'
        })
        this.loadingReset = false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
        this.loadingReset = false
      })
    }
  }
}
</script>

<style>
 .show-pwd {
  /* right: 10px;
  top: 7px; */
  position: absolute;
  font-size: 25px;
  cursor: pointer;
  user-select: none;
 }
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
  .userAvatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

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
          action="http://localhost:8088/users/upload"
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
        <el-select v-model="addUserForm.userRole" placeholder="请选择角色" tabindex="6">
          <el-option
            v-for="item in options"
            :key="item.userRole"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click.native.prevent="submitForm">提交</el-button>
        <el-button @click.native.prevent="resetForm">重置</el-button>
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
        callback(new Error('请输入正确的用户名/电子邮箱/手机号码'))
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
        userRole: ''
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
      passwordType: 'password',
      redirect: undefined
    }
  },
  methods: {
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
      this.$refs.addUserForm.validate(valid => {
        if (valid) {
          this.loading = true
          console.log(this.addUserForm)
          this.$store.dispatch('user/addUser', this.addUserForm).then(() => {
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
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
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

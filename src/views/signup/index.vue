<template>
  <div class="login-container">
    <el-form ref="signupForm" :model="signupForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">创建账户</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="signupForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="userPhone">
        <span class="svg-container">
          <i class="el-icon-phone-outline" />
        </span>
        <el-input
          ref="userPhone"
          v-model="signupForm.userPhone"
          placeholder="手机号"
          name="userPhone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="userEmail">
        <span class="svg-container">
          <i class="el-icon-message" />
        </span>
        <el-input
          ref="userEmail"
          v-model="signupForm.userEmail"
          placeholder="电子邮箱"
          name="userEmail"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="signupForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleSignUp"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="confirmPasswordType"
          ref="confirmPassword"
          v-model="signupForm.confirmPassword"
          :type="confirmPasswordType"
          placeholder="确认密码"
          name="confirmPassword"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleSignUp"
        />
        <span class="show-pwd" @click="showConfirmPwd">
          <svg-icon :icon-class="confirmPasswordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <span style="color:white;">已有账号？</span> <el-button type="text" @click.native.prevent="login">登录</el-button>
      <br>
      <br>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleSignUp">注册</el-button>

    </el-form>
  </div>
</template>

<script>
import { validUserName, validUserEmail, validUserPhone } from '@/utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
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
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.signupForm.password) {
        callback(new Error('两次输入的密码不一致，请重新输入'))
      } else if (value.length < 6) {
        callback(new Error('密码不能小于6个字符'))
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
    return {
      signupForm: {
        username: '',
        userPhone: '',
        userEmail: '',
        userAvatar: '',
        password: '',
        confirmPassword: '',
        userRole: '',
        userCreatedAt: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUserName }],
        userPhone: [{ required: true, trigger: 'blur', validator: validateUserPhone }],
        userEmail: [{ required: true, trigger: 'blur', validator: validateUserEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
      },
      loading: false,
      passwordType: 'password',
      confirmPasswordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    ...mapGetters([
      'userName',
      'userRole'
    ])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
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
        this.$refs.password.focus()
      })
    },
    showConfirmPwd() {
      if (this.confirmPasswordType === 'password') {
        this.confirmPasswordType = ''
      } else {
        this.confirmPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.confirmPassword.focus()
      })
    },
    async login() {
      const path = ''
      this.$router.push(`/login?redirect=${path}`)
    },
    // handleLogin() {
    //   this.$refs.signupForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store.dispatch('user/login', this.signupForm).then((res) => {
    //         this.$router.push({ path: this.redirect || '/' })
    //         this.loading = false
    //       }).catch(() => {
    //         this.loading = false
    //       })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // }
    handleSignUp() {
      this.$refs.signupForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.signupForm.userCreatedAt = this.getLocalISOTime()
          this.signupForm.userRole = 'user'
          this.signupForm.userAvatar = 'https://pic.imgdb.cn/item/65db4a0b9f345e8d03470a51.webp'
          this.$store.dispatch('user/signup', this.signupForm).then((res) => {
            console.log(this.signupForm)
            const path = ''
            this.$router.push(`/login?redirect=${path}`)
            this.loading = false
          }).catch((error) => {
            this.$message.error(error)
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    padding: 100px 35px 0;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      margin: 0px auto 20px auto;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

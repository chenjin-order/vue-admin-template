<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="account"
          v-model="loginForm.account"
          placeholder="用户名/电子邮箱/手机号码"
          name="account"
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
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <span style="color: white;">还没有账号？</span><el-button type="text" @click.native.prevent="signup">注册</el-button>
      <br>
      <br>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

    </el-form>
  </div>
</template>

<script>
import { validUserName, validUserEmail, validUserPhone } from '@/utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUserName(value) && !validUserEmail(value) && !validUserPhone(value)) {
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
    return {
      loginForm: {
        account: 'default',
        password: '123456789'
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
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
    // handleLogin() {
    //   this.$refs.loginForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store.dispatch('user/login', this.loginForm).then((res) => {
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const loginForm = {
            account: this.loginForm.account,
            userPassword: this.loginForm.password
          }
          this.$store.dispatch('user/login', loginForm).then((res) => {
            const redirectPath = this.userRole === 'user' ? '/homepage' : this.redirect || '/'
            this.$router.push({ path: redirectPath })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('提交错误!!')
          return false
        }
      })
    },
    async signup() {
      this.$router.push(`/signup`)
    }
    // handleLogin() {
    //   this.$refs.loginForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store.dispatch('user/login', this.loginForm).then(() => {
    //         // this.$router.push({ path: this.redirect || '/homepage' })
    //         this.$store.dispatch('user/getInfo').then((res) => {
    //           if (res.userInfo.userRole === 'user') {
    //             this.$router.push({ path: '/homepage' })
    //           } else {
    //             // this.$router.push({ path: this.redirect || '/' })
    //             this.$router.push({ path: '/' })
    //           }
    //           console.log(this.redirect)
    //         }).catch(() => {
    //           this.loading = false
    //         })
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
    // handleLogin() {
    //   this.$refs.loginForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store.dispatch('user/login', this.loginForm).then(() => {
    //         // 登录成功后，获取用户信息
    //         this.$store.dispatch('user/getInfo').then((res) => {
    //           // 根据userRole判断跳转路由
    //           const { userRole } = res.userInfo
    //           const redirectPath = userRole === 'user' ? '/homepage' : this.redirect || '/'
    //           this.$router.push({ path: redirectPath })
    //           console.log(userRole)
    //           this.loading = false
    //         }).catch(() => {
    //           // 获取用户信息失败的处理
    //           console.error('Error fetching user info')
    //           this.loading = false
    //         })
    //       }).catch(() => {
    //         // 登录失败的处理
    //         this.loading = false
    //       })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // }
    // async handleLogin() {
    //   try {
    //     // 验证表单
    //     if (!(await this.$refs.loginForm.validate())) {
    //       console.log('error submit!!')
    //       return
    //     }

    //     this.loading = true

    //     // 发送登录请求
    //     await this.$store.dispatch('user/login', this.loginForm)

    //     // 获取用户信息
    //     const userInfo = await this.$store.dispatch('user/getInfo')

    //     // 根据用户角色重定向
    //     if (userInfo.userRole === 'user') {
    //       this.$router.push({ path: '/homepage' })
    //     } else {
    //       this.$router.push({ path: this.redirect || '/' })
    //     }

    //     console.log(userInfo.userRole)
    //   } catch (error) {
    //     // 处理错误
    //     console.error('Login failed:', error)
    //   } finally {
    //     // 无论成功还是失败，都设置加载状态为 false
    //     this.loading = false
    //   }
    // }
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

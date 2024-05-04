<template>
  <div id="pw-setting-container">
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <el-form ref="form" label-position="top" :rules="pwRules" :model="form">
            <el-form-item ref="userName" label="用户名：" prop="userName">
              <el-input v-model="maskedUserName" placeholder="" :disabled="true" class="setting-input" />
            </el-form-item>
            <el-form-item ref="userPassword" label="密码：" prop="userPassword">
              <el-input v-model="form.userPassword" placeholder="请输入新密码" class="setting-input" show-password />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click.native.prevent="updatePW">
            确定
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {

  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6个字符'))
      } else {
        callback()
      }
    }
    return {
      form: {
        userId: '',
        userName: '',
        userPassword: ''
      },
      pwRules: {
        userPassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },

  computed: {
    ...mapGetters([
      'userName',
      'userRole',
      'userAvatar'
    ]),
    maskedUserName() {
      // 显示用户名的前三个字符，并用星号(*)替换其余部分
      // 你可以根据需要修改这个函数
      if (!this.userName) return ''
      return this.userName.length > 3
        ? `${this.userName.slice(0, 3)}****`
        : this.userName
    },
    isPasswordValid() {
      // 验证密码是否至少包含6个字符
      return this.userPassword.length >= 6
    }
  },

  mounted() {
    this.getUserInfo()
  },

  methods: {
    getUserInfo() {
      this.$store.dispatch('user/getUserInfo').then((res) => {
        this.userId = res.settingsUsersInfoVo.userId
      }).catch(() => {
        console.log('failed')
      })
    },
    updatePW() {
      this.$confirm('确认修改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate(valid => {
          if (valid) {
            const pwForm = {
              userId: this.userId,
              userPassword: this.form.userPassword
            }
            this.$store.dispatch('user/updatePW', pwForm).then(() => {
              this.$message({
                type: 'success',
                message: '成功!'
              })
              this.logout()
            }).catch(() => {
              this.$message.error('修改失败')
            })
          } else {
            this.$message.error('修改信息错误，请重新输入')
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      const homepagePath = this.$route.fullPath
      const path = ''
      if (homepagePath.startsWith('/homepage') ||
          homepagePath.startsWith('/articlePage') ||
        homepagePath.startsWith('/eventPage') ||
      homepagePath.startsWith('/responsePage')) {
        this.$router.push(`/login?redirect=${path}`)
      } else {
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card{
  margin: 10px;
  min-height: 600px;
  border-radius: 10px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col{
  margin-top: 10px;
  border-radius: 10px;
}
.setting-input{
  width: 20%;
}
</style>

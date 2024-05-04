<template>
  <div id="email-setting-container">
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <span>已设置邮箱</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span style="font-size: 50px;">
            {{ userEmail }}
          </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click.native.prevent="dialogVisible = true">
            更改邮箱
          </el-button>
        </el-col>
      </el-row>
      <el-dialog
        center
        title="设置邮箱"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        class="custom-dialog"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="新邮箱" prop="newEmail">
            <el-input v-model="form.newEmail" placeholder="请输入新邮箱" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click.native.prevent="cancelUpdate">取 消</el-button>
          <el-button type="primary" @click="updateEmail">提交</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { validUserEmail } from '@/utils/validate'
export default {
  data() {
    const validateUserEmail = (rule, value, callback) => {
      if (!validUserEmail(value)) {
        callback(new Error('请输入正确的电子邮箱'))
      } else {
        callback()
      }
    }
    return {
      userId: '',
      userEmail: '',
      dialogVisible: false,
      form: {
        newEmail: ''
      },
      rules: {
        newEmail: [{ required: true, trigger: 'blur', validator: validateUserEmail }]
      }
    }
  },

  mounted() {
    this.getUserInfo()
  },

  methods: {
    getUserInfo() {
      this.$store.dispatch('user/getUserInfo').then((res) => {
        this.userEmail = res.settingsUsersInfoVo.userEmail
        this.userId = res.settingsUsersInfoVo.userId
      }).catch(() => {
        console.log('failed')
      })
    },
    updateEmail() {
      this.$confirm('确认提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate(valid => {
          if (valid) {
            const emailForm = {
              userId: this.userId,
              userEmail: this.form.newEmail
            }
            this.$store.dispatch('user/updateEmail', emailForm).then(() => {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.dialogVisible = false
              this.getUserInfo()
              this.form.newEmail = ''
            }).catch(() => {
              this.$message.error('提交失败')
            })
          } else {
            this.$message.error('提交信息错误，请重新输入')
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
    handleClose(done) {
      this.$confirm('确认关闭？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(_ => {
          done()
          this.$message({
            type: 'info',
            message: '已取消更改'
          })
        })
        .catch(_ => {})
    },
    cancelUpdate() {
      this.$confirm('确定取消更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogVisible = false
        this.$message({
          type: 'info',
          message: '已取消更改'
        })
      }).catch(() => {
      })
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
</style>

<template>
  <div id="phone-setting-container">
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <span>已设置手机</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span style="font-size: 50px;">{{ userPhone }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click.native.prevent="dialogVisible = true">
            更改手机号
          </el-button>
        </el-col>
      </el-row>
      <el-dialog
        center
        title="设置手机号"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        class="custom-dialog"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="新手机号" prop="newPhone">
            <el-input v-model="form.newPhone" placeholder="请输入新手机号" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click.native.prevent="cancelUpdate">取 消</el-button>
          <el-button type="primary" @click="updatePhone">提交</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { validUserPhone } from '@/utils/validate'
export default {
  data() {
    const validateUserPhone = (rule, value, callback) => {
      if (!validUserPhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      userId: '',
      userPhone: '',
      dialogVisible: false,
      form: {
        newPhone: ''
      },
      rules: {
        newPhone: [{ required: true, trigger: 'blur', validator: validateUserPhone }]
      }
    }
  },

  mounted() {
    this.getUserInfo()
  },

  methods: {
    getUserInfo() {
      this.$store.dispatch('user/getUserInfo').then((res) => {
        this.userPhone = res.settingsUsersInfoVo.userPhone
        this.userId = res.settingsUsersInfoVo.userId
      }).catch(() => {
        console.log('failed')
      })
    },
    updatePhone() {
      this.$confirm('确认提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate(valid => {
          if (valid) {
            const phoneForm = {
              userId: this.userId,
              userPhone: this.form.newPhone
            }
            this.$store.dispatch('user/updatePhone', phoneForm).then(() => {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.dialogVisible = false
              this.getUserInfo()
              this.form.newPhone = ''
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
.custom-dialog {
  /* 你可以根据需要调整 border-radius 的值 */
  border-radius: 10px;
  /* 如果你想让标题栏和内容区域都有圆角，可能需要额外设置 */
  .el-dialog__header {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .el-dialog__body,
  .el-dialog__footer {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
</style>

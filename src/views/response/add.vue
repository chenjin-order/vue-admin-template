<template>
  <el-form ref="addResponseForm" :model="addResponseForm" :rules="addResponseRules" label-width="120px">
    <el-form-item label="灾害事件" prop="responsesEventId">
      <el-select ref="responsesEventId" v-model="addResponseForm.responsesEventId" filterable placeholder="请选择灾害事件">
        <el-option
          v-for="event in eventsName"
          :key="event.eventId"
          :label="event.eventName"
          :value="event.eventId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="应对措施类型" prop="responseTypeId">
      <el-select ref="responseTypeId" v-model="addResponseForm.responseTypeId" placeholder="请选择应对措施">
        <el-option
          v-for="item in responseTypes"
          :key="item.typeId"
          :label="item.typeName"
          :value="item.typeId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="措施的详情" prop="responseDetails">
      <Editor
        ref="responseDetails"
        v-model="addResponseForm.responseDetails"
        api-key="fq7y3tke9bonk5vpix4f63v9xxrthfrfg01t3tgxk2p102nn"
        :init="{
          height: 400,
          language: 'zh_CN',
          branding: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'
        }"
      />
    </el-form-item>
    <el-form-item>
      <el-button :loading="loading" type="primary" @click.native.prevent="submitForm">提交</el-button>
      <el-button :loading="loadingReset" @click.native.prevent="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getResponseTypes } from '@/api/response'
import { getEventNameList } from '@/api/event'
import Editor from '@tinymce/tinymce-vue'

export default {
  components: {
    Editor
  },
  data() {
    const validateForm = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('内容不能为空'))
      } else {
        callback()
      }
    }
    return {
      eventsName: [],
      responseTypes: [],
      addResponseForm: {
        responsesEventId: '',
        responseTypeId: '',
        responseDetails: ''
      },
      addResponseRules: {
        responseDetails: [{ trigger: 'blur', validator: validateForm }]
      },
      loading: false,
      loadingReset: false
    }
  },
  created: function() {
    getResponseTypes().then((response) => {
      this.responseTypes = response.data.items
    })
    getEventNameList().then((response) => {
      this.eventsName = response.data.items
    })
  },
  methods: {
    submitForm() {
      this.loading = true
      this.$confirm('确定提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.addResponseForm.validate(valid => {
          if (valid) {
            this.$store.dispatch('response/addResponse', this.addResponseForm).then(() => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message.error('提交应对措施信息错误，请重新输入')
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
        this.$refs.addResponseForm.resetFields()
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

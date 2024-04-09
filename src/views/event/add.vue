<template>
  <div class="app-container">
    <el-form ref="addEventForm" :model="addEventForm" :rules="addEventRules" class="addEvent-form" autocomplete="on" label-position="top">
      <el-form-item label="事件的名称" prop="eventName">
        <el-input ref="eventName" v-model="addEventForm.eventName" prefix-icon="el-icon-warning-outline" />
      </el-form-item>
      <el-form-item label="事件类型" prop="eventTypeId">
        <el-select ref="eventTypeId" v-model="addEventForm.eventTypeId" placeholder="请选择">
          <el-option
            v-for="item in eventTypes"
            :key="item.typeId"
            :label="item.typeName"
            :value="item.typeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="事件发生的地点" prop="eventLocation">
        <el-input ref="eventLocation" v-model="addEventForm.eventLocation" prefix-icon="el-icon-location-outline" />
      </el-form-item>
      <el-form-item label="事件的开始日期" prop="eventStartDate">
        <el-date-picker
          ref="eventStartDate"
          v-model="addEventForm.eventStartDate"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="事件的结束日期" prop="eventEndDate">
        <el-date-picker
          ref="eventEndDate"
          v-model="addEventForm.eventEndDate"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="事件的严重程度级别" prop="eventSeverityLevel">
        <el-select ref="eventSeverityLevel" v-model="addEventForm.eventSeverityLevel" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.eventSeverityLevel"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="事件的描述" prop="eventDescription">
        <Editor
          ref="eventDescription"
          v-model="addEventForm.eventDescription"
          api-key="fq7y3tke9bonk5vpix4f63v9xxrthfrfg01t3tgxk2p102nn"
          :init="{
            height: 200,
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
      <el-form-item label="信息来源" prop="eventSource">
        <el-input ref="eventSource" v-model="addEventForm.eventSource" prefix-icon="el-icon-bell" />
      </el-form-item>
      <el-form-item label="事件相关图片的URL" prop="eventImageUrl">
        <el-upload
          ref="eventImageUrl"
          v-model="addEventForm.eventImageUrl"
          class="eventImageUrl-uploader"
          action="http://localhost:8080/upload/uploadEventImage"
          :show-file-list="false"
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload"
          name="eventImageUrl"
        >
          <img v-if="imageUrl" :src="imageUrl" class="eventImageUrl">
          <i v-else class="el-icon-plus eventImageUrl-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width: 100px;" @click.native.prevent="submitForm">提交</el-button>
        <el-button :loading="loadingReset" style="width: 100px;" @click.native.prevent="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEventTypes } from '@/api/event'
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
      loading: false,
      loadingReset: false,
      imageUrl: '',
      dialogVisible: false,
      eventTypes: [],
      addEventForm: {
        eventName: '',
        eventTypeId: '',
        eventLocation: '',
        eventStartDate: '',
        eventEndDate: '',
        eventSeverityLevel: '',
        eventDescription: '',
        eventSource: '',
        eventImageUrl: ''
      },
      addEventRules: {
        eventName: [{ trigger: 'blur', validator: validateForm }],
        eventLocation: [{ trigger: 'blur', validator: validateForm }],
        eventSeverityLevel: [{ trigger: 'blur', validator: validateForm }],
        eventSource: [{ trigger: 'blur', validator: validateForm }]
      },
      options: [{
        value: 'low',
        label: 'low'
      }, {
        value: 'medium',
        label: 'medium'
      }, {
        value: 'high',
        label: 'high'
      }
      ]
    }
  },
  created: function() {
    getEventTypes().then((response) => {
      this.eventTypes = response.data.items
    })
  },
  methods: {
    handleImageSuccess(res, file) {
      this.addEventForm.eventImageUrl = file.response.data.eventImageUrl
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeImageUpload(file) {
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
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.imageUrl = file.url
      this.dialogVisible = true
    },
    submitForm() {
      this.loading = true
      this.$confirm('确定提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.addEventForm.validate(valid => {
          if (valid) {
            this.$store.dispatch('event/addEvent', this.addEventForm).then(() => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message.error('提交事件信息错误，请重新输入')
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
        this.$refs.addEventForm.resetFields()
        this.addEventForm.eventImageUrl = ''
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
.eventImageUrl-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
.eventImageUrl-uploader .el-upload:hover {
  border-color: #409EFF;
}
.eventImageUrl-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.eventImageUrl {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

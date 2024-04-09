<template>
  <div class="app-container">
    <el-input v-model="queryKeyword" placeholder="请输入查询关键字" style="width: 200px;margin-right: 20px;" />
    <el-button :loading="loadingEventSearch" type="primary" style="width: 100px;" @click.native.prevent="eventSearch">查询</el-button>
    <el-button :loading="loadingEventSearchAll" type="primary" style="width: 100px;" @click.native.prevent="eventSearchAll">查询全部</el-button>
    <el-table
      ref="eventMultipleTable"
      :data="tableData"
      border
      height="550"
      style="width: 1415px;"
      :default-sort="{ prop: 'id', order: 'ascending'}"
      @selection-change="handleSelectionChangeEvent"
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column prop="eventId" label="ID" sortable align="center" width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.eventId }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="eventName" label="事件名称" align="center" width="220">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.eventName }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="类型名称" align="center" width="250">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.typeName }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="eventLocation" label="事件发生的地点" align="center" width="250">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.eventLocation }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="eventStartDate" label="事件的开始日期" align="center" width="210">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px;"> {{ scope.row.eventStartDate }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="eventEndDate" label="事件的结束日期" align="center" width="210">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px;"> {{ scope.row.eventEndDate }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="eventSeverityLevel" label="事件的严重程度级别" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.eventSeverityLevel }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="eventDescription" label="事件的描述" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.eventDescription }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="eventSource" label="信息来源" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.eventSource }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="eventImageUrl" label="事件相关图片的URL" align="center" width="170">
        <template slot-scope="scope">
          <!-- <el-avatar shape="square" :size="80" :src="getFullImageUrl(scope.row.userAvatar)" /> -->
          <el-avatar shape="square" :size="80" :src="scope.row.eventImageUrl" />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="operate"
        label="操作"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            :loading="loadingEditorEvent"
            size="mini"
            @click="handleEditEvent(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            :loading="loadingDeleteEvent"
            size="mini"
            type="danger"
            @click="handleDeleteEvent(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑事件" :visible.sync="dialogFormVisible" :before-close="handleClose" :destroy-on-close="true">
      <el-form ref="editorEventForm" :model="editorEventForm" :rules="editorEventRules" class="addEvent-form" autocomplete="on" label-position="top">
        <el-form-item label="事件的名称" prop="eventName">
          <el-input ref="eventName" v-model="editorEventForm.eventName" prefix-icon="el-icon-warning-outline" />
        </el-form-item>
        <el-form-item label="事件类型" prop="eventTypeId">
          <el-select ref="eventTypeId" v-model="editorEventForm.eventTypeId" placeholder="请选择">
            <el-option
              v-for="item in eventTypes"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事件发生的地点" prop="eventLocation">
          <el-input ref="eventLocation" v-model="editorEventForm.eventLocation" prefix-icon="el-icon-location-outline" />
        </el-form-item>
        <el-form-item label="事件的开始日期" prop="eventStartDate">
          <el-date-picker
            ref="eventStartDate"
            v-model="editorEventForm.eventStartDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="事件的结束日期" prop="eventEndDate">
          <el-date-picker
            ref="eventEndDate"
            v-model="editorEventForm.eventEndDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="事件的严重程度级别" prop="eventSeverityLevel">
          <el-select ref="eventSeverityLevel" v-model="editorEventForm.eventSeverityLevel" placeholder="请选择">
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
            v-model="editorEventForm.eventDescription"
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
          <el-input ref="eventSource" v-model="editorEventForm.eventSource" prefix-icon="el-icon-bell" />
        </el-form-item>
        <el-form-item label="事件相关图片的URL" prop="eventImageUrl">
          <el-upload
            ref="eventImageUrl"
            v-model="editorEventForm.eventImageUrl"
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
        :loading="loadingBatchDeleteEvent"
        type="danger"
        @click="handleBatchDeleteResponse"
      >批量删除</el-button>
    </div>
  </div>
</template>
<script>
import Editor from '@tinymce/tinymce-vue'
import { getEventInfo, getEventTypes } from '@/api/event'
export default ({
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
      queryKeyword: '',
      imageUrl: '',
      currentPage: 1,
      total: 1,
      pageSize: 1,
      isShow: false,
      eventTypes: [],
      tableData: [],
      multipleSelectionEvent: [],
      loadingEditorEvent: false,
      loadingEditorSubmit: false,
      loadingEditorReset: false,
      loadingEditorCancel: false,
      loadingDeleteEvent: false,
      loadingBatchDeleteEvent: false,
      loadingEventSearch: false,
      loadingEventSearchAll: false,
      dialogFormVisible: false,
      editorEventForm: {
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
      initialEditorEventForm: {
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
      editorEventRules: {
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
  watch: {
    currentPage(newVal) {
      this.changePage(newVal)
    },
    mounted() {
      this.changePage(this.currentPage)
    }
  },
  created: function() {
    getEventInfo().then((response) => {
      this.tableData = response.data.items.records

      this.total = response.data.items.total

      this.pageSize = response.data.items.size

      this.isShow = true
    })
    getEventTypes().then((response) => {
      this.eventTypes = response.data.items
    })
  },
  methods: {
    handleImageSuccess(res, file) {
      this.editorEventForm.eventImageUrl = file.response.data.eventImageUrl
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
    formatDateWithSeconds(date) {
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      const hours = ('0' + date.getHours()).slice(-2)
      const minutes = ('0' + date.getMinutes()).slice(-2)
      const seconds = ('0' + date.getSeconds()).slice(-2)
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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
          this.loadingEditorEvent = false
          this.changePage()
        })
        .catch(_ => {})
    },
    eventSearch() {
      this.loadingEventSearch = true
      if (this.queryKeyword) {
        getEventInfo(this.currentPage, this.queryKeyword).then((response) => {
          this.tableData = response.data.items.records
          this.total = response.data.items.total
          this.pageSize = response.data.items.size
        })
        this.$message({
          type: 'success',
          message: '查询成功!'
        })
        this.loadingEventSearch = false
      } else {
        this.loadingEventSearch = false
        this.$message({
          type: 'error',
          message: '查询条件不能为空'
        })
      }
    },
    eventSearchAll() {
      this.loadingEventSearchAll = true
      getEventInfo().then((response) => {
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
        this.loadingEventSearchAll = false
      })
    },
    handleSelectionChangeEvent(val) {
      this.multipleSelectionEvent = val
    },
    changePage(eventPageNum) {
      if (eventPageNum) {
        this.currentPage = eventPageNum
      }
      getEventInfo(this.currentPage, this.queryKeyword).then((response) => {
        this.tableData = response.data.items.records
      })
    },
    handleEditEvent(index, row) {
      this.editorEventForm = { ...row }
      this.imageUrl = row.eventImageUrl
      this.loadingEditorEvent = true
      this.dialogFormVisible = true
      const matchingEventType = this.eventTypes.find(eventType => eventType.typeName === row.typeName)
      if (matchingEventType) {
        this.$set(this.editorEventForm, 'eventTypeId', matchingEventType.typeId)
      } else {
        this.$message({
          type: 'error',
          message: '获取表格数据失败!'
        })
        this.editorEventForm.eventTypeId = null
        this.dialogFormVisible = false
        this.loadingEditorEvent = false
      }
      this.initialEditorEventForm = { ...this.editorEventForm }
    },
    handleDeleteEvent(index, row) {
      this.loadingDeleteEvent = true
      this.$confirm('此操作将永久删除该事件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('event/deleteEvent', row.eventId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadingDeleteEvent = false
          this.changePage()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          this.loadingDeleteEvent = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.loadingDeleteEvent = false
      })
    },
    handleBatchDeleteResponse() {
      const eventIdList = this.multipleSelectionEvent.map(item => item.eventId)
      this.loadingBatchDeleteEvent = true
      if (eventIdList.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选择要删除的事件!'
        })
        this.loadingBatchDeleteEvent = false
        return
      }
      this.$alert('此操作将永久删除事件信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('event/deleteBatchEvent', eventIdList).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadingBatchDeleteEvent = false
          this.changePage()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          this.loadingBatchDeleteEvent = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.loadingBatchDeleteEvent = false
      })
    },
    submitForm() {
      this.loadingEditorSubmit = true
      console.log(this.editorEventForm)
      this.$confirm('确定提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.editorEventForm.validate(valid => {
          if (valid) {
            this.$store.dispatch('event/editorEvent', this.editorEventForm).then(() => {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.loadingEditorSubmit = false
              this.dialogFormVisible = false
              this.loadingEditorEvent = false
              this.changePage()
            }).catch(() => {
              this.$message.error('提交失败')
              this.loadingEditorSubmit = false
            })
          } else {
            this.$message.error('提交文章信息错误，请重新输入')
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
        this.changePage()
      })
    },
    resetForm() {
      this.loadingEditorReset = true
      this.$confirm('确定重置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.editorEventForm.resetFields()
        this.editorEventForm.eventImageUrl = ''
        this.imageUrl = this.initialEditorEventForm.eventImageUrl
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
        this.loadingEditorEvent = false
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
<style>
.el-table .cell {
    white-space: nowrap;
    overflow: hidden; /* 隐藏超出单元格宽度的内容 */
    text-overflow: ellipsis; /* 当内容超出单元格宽度时，用省略号表示 */
}
.tox-tinymce-aux{z-index:99999 !important;}
.tinymce.ui.FloatPanel{z-Index: 99;}
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

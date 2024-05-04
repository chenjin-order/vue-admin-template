<template>
  <div class="app-container">
    <el-input v-model="queryKeyword" placeholder="请输入查询关键字" style="width: 200px;margin-right: 20px;" />
    <el-button :loading="loadingResponseSearch" type="primary" style="width: 100px;" @click.native.prevent="responseSearch">查询</el-button>
    <el-button :loading="loadingResponseSearchAll" type="primary" style="width: 100px;" @click.native.prevent="responseSearchAll">查询全部</el-button>
    <el-table
      ref="responseMultipleTable"
      :data="responseTableData"
      border
      height="550"
      style="width: 1415px;"
      :default-sort="{ prop: 'id', order: 'ascending'}"
      @selection-change="handleSelectionChangeResponse"
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column prop="responsesId" label="ID" sortable align="center" width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.responsesId }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="eventName" label="灾害事件名称" align="center" width="250">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.eventName }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="应对措施类型" align="center" width="220">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.typeName }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="responseDetails" label="措施详情" align="center" width="620">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.responseDetails }} </span>
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
            :loading="loadingEditor"
            size="mini"
            @click="handleEditResponse(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            :loading="loadingDeleteResponse"
            size="mini"
            type="danger"
            @click="handleDeleteResponse(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑应对措施" :visible.sync="dialogFormVisible" :before-close="handleClose" :destroy-on-close="true">
      <el-form ref="editorResponseForm" :model="editorResponseForm" :rules="editorResponseRules" label-width="120px" autocomplete="on" label-position="top">
        <el-form-item label="灾害事件" prop="responsesEventId">
          <el-select ref="responsesEventId" v-model="editorResponseForm.responsesEventId" filterable placeholder="请选择灾害事件">
            <el-option
              v-for="event in eventsName"
              :key="event.eventId"
              :label="event.eventName"
              :value="event.eventId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应对措施类型" prop="responseTypeId">
          <el-select ref="responseTypeId" v-model="editorResponseForm.responseTypeId" placeholder="请选择应对措施">
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
            v-model="editorResponseForm.responseDetails"
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
        :loading="loadingBatchDeleteResponse"
        type="danger"
        @click="handleBatchDeleteResponse"
      >批量删除</el-button>
    </div>
  </div>
</template>
<script>
import Editor from '@tinymce/tinymce-vue'
import { getResponseTypes, getResponseInfo } from '@/api/response'
import { getEventNameList } from '@/api/event'
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
      currentPage: 1,
      total: 1,
      pageSize: 1,
      isShow: false,
      responseTableData: [],
      multipleSelectionResponse: [],
      eventsName: [],
      responseTypes: [],
      loading: false,
      loadingEditor: false,
      loadingEditorSubmit: false,
      loadingEditorReset: false,
      loadingEditorCancel: false,
      loadingDeleteResponse: false,
      loadingBatchDeleteResponse: false,
      loadingResponseSearch: false,
      loadingResponseSearchAll: false,
      dialogFormVisible: false,
      editorResponseForm: {
        responsesEventId: '',
        responseTypeId: '',
        responseDetails: ''
      },
      editorResponseRules: {
        responseDetails: [{ trigger: 'blur', validator: validateForm }]
      }
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
    getResponseInfo().then((response) => {
      // // this.responseTableData = response.data.items.records
      // const newArticles = response.data.items.records.map(response => {
      //   const newArticle = { ...response }
      //   // //  ISO 字符串转换为 Date 对象
      //   // const date = new Date(newUser.userCreatedAt)
      //   // // 原生 JavaScript 方法进行格式化Date
      //   // newUser.userCreatedAt = this.formatDateWithSeconds(date)
      //   // // newUser.userCreatedAt = new Date(newUser.userCreatedAt)
      //   newArticle.articleCreatedAt = this.formatDateWithSeconds(new Date(newArticle.articleCreatedAt))
      //   newArticle.articleUpdatedAt = this.formatDateWithSeconds(new Date(newArticle.articleUpdatedAt))
      //   return newArticle
      // })

      this.responseTableData = response.data.items.records

      this.total = response.data.items.total

      this.pageSize = response.data.items.size

      this.isShow = true
    })
    getResponseTypes().then((response) => {
      this.responseTypes = response.data.items
    })
    getEventNameList().then((response) => {
      this.eventsName = response.data.items
    })
  },
  methods: {
    // formatDateWithSeconds(date) {
    //   const year = date.getFullYear()
    //   const month = ('0' + (date.getMonth() + 1)).slice(-2)
    //   const day = ('0' + date.getDate()).slice(-2)
    //   const hours = ('0' + date.getHours()).slice(-2)
    //   const minutes = ('0' + date.getMinutes()).slice(-2)
    //   const seconds = ('0' + date.getSeconds()).slice(-2)
    //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    // },
    // getLocalISOTime() {
    //   const now = new Date()
    //   const year = now.getFullYear()
    //   const month = String(now.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要+1并补0
    //   const date = String(now.getDate()).padStart(2, '0') // 日期补0
    //   const hours = String(now.getHours()).padStart(2, '0') // 小时补0
    //   const minutes = String(now.getMinutes()).padStart(2, '0') // 分钟补0
    //   const seconds = String(now.getSeconds()).padStart(2, '0') // 秒补0
    //   return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}`
    // },
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
          this.loadingEditor = false
          this.changePage()
        })
        .catch(_ => {})
    },
    responseSearch() {
      this.loadingResponseSearch = true
      if (this.queryKeyword) {
        getResponseInfo(this.currentPage, this.queryKeyword).then((response) => {
          this.responseTableData = response.data.items.records
          this.total = response.data.items.total
          this.pageSize = response.data.items.size
        })
        this.$message({
          type: 'success',
          message: '查询成功!'
        })
        this.loadingResponseSearch = false
      } else {
        this.loadingResponseSearch = false
        this.$message({
          type: 'error',
          message: '查询条件不能为空'
        })
      }
    },
    responseSearchAll() {
      this.loadingResponseSearchAll = true
      getResponseInfo().then((response) => {
        this.responseTableData = response.data.items.records
        this.total = response.data.items.total
        this.pageSize = response.data.items.size
        this.queryKeyword = ''
        this.currentPage = 1
        this.$message({
          type: 'success',
          message: '查询成功!'
        })
      }).finally(() => {
        this.loadingResponseSearchAll = false
      })
    },
    handleSelectionChangeResponse(val) {
      this.multipleSelectionResponse = val
    },
    changePage(articlePageNum) {
      if (articlePageNum) {
        this.currentPage = articlePageNum
      }
      getResponseInfo(this.currentPage, this.queryKeyword).then((response) => {
        this.responseTableData = response.data.items.records
      })
    },
    handleEditResponse(index, row) {
      this.editorResponseForm = { ...row }
      this.loadingEditor = true
      this.dialogFormVisible = true
      const matchingEvent = this.eventsName.find(event => event.eventName === row.eventName)
      const matchingResponseType = this.responseTypes.find(responseType => responseType.typeName === row.typeName)
      if (matchingEvent && matchingResponseType) {
        this.$set(this.editorResponseForm, 'responsesEventId', matchingEvent.eventId)
        this.$set(this.editorResponseForm, 'responseTypeId', matchingResponseType.typeId)
      } else {
        this.$message({
          type: 'error',
          message: '获取表格数据失败!'
        })
        this.editorResponseForm.responsesEventId = null
        this.editorResponseForm.responseTypeId = null
        this.dialogFormVisible = false
        this.loadingEditor = false
      }
    },
    handleDeleteResponse(index, row) {
      this.loadingDeleteResponse = true
      this.$confirm('此操作将永久删除该措施, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('response/deleteResponse', row.responsesId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadingDeleteResponse = false
          this.changePage()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          this.loadingDeleteResponse = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.loadingDeleteResponse = false
      })
    },
    handleBatchDeleteResponse() {
      const responsesIdList = this.multipleSelectionResponse.map(item => item.responsesId)
      this.loadingBatchDeleteResponse = true
      if (responsesIdList.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选择要删除的措施!'
        })
        this.loadingBatchDeleteResponse = false
        return
      }
      this.$alert('此操作将永久删除措施信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('response/deleteBatchResponse', responsesIdList).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadingBatchDeleteResponse = false
          this.changePage()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          this.loadingBatchDeleteResponse = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.loadingBatchDeleteResponse = false
      })
    },
    submitForm() {
      this.loadingEditorSubmit = true
      this.$confirm('确定提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.editorResponseForm.validate(valid => {
          if (valid) {
            console.log(this.editorResponseForm)
            this.$store.dispatch('response/editorResponse', this.editorResponseForm).then(() => {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.loadingEditorSubmit = false
              this.dialogFormVisible = false
              this.loadingEditor = false
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
        this.$refs.editorResponseForm.resetFields()
        console.log(this.editorResponseForm)
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
        this.loadingEditor = false
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
</style>

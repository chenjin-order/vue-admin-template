<template>
  <div class="app-container">
    <el-input v-model="queryKeyword" placeholder="请输入查询关键字" style="width: 200px;margin-right: 20px;" />
    <el-button :loading="loadingArticleSearch" type="primary" style="width: 100px;" @click.native.prevent="articleSearch">查询</el-button>
    <el-button :loading="loadingArticleSearchAll" type="primary" style="width: 100px;" @click.native.prevent="articleSearchAll">查询全部</el-button>
    <el-table
      ref="articleMultipleTable"
      :data="articleTableData"
      border
      height="550"
      style="width: 1415px;"
      :default-sort="{ prop: 'id', order: 'ascending'}"
      @selection-change="handleSelectionChangeArticle"
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column prop="articleId" label="ID" sortable align="center" width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.articleId }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="articleTitle" label="文章标题" align="center" width="220">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.articleTitle }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="articleContent" label="文章内容" align="center" width="250">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.articleContent }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="articleCreatedAt" label="创建时间" align="center" width="210">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px;"> {{ scope.row.articleCreatedAt }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="articleUpdatedAt" label="更新时间" align="center" width="210">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px;"> {{ scope.row.articleUpdatedAt }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="articleLikes" label="文章点赞数" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.articleLikes }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="articleViews" label="文章阅读数" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.articleViews }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="文章作者" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.userName }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="文章类型" align="center" width="170">
        <template slot-scope="scope">
          <span style="margin-left: 10px;"> {{ scope.row.categoryName }} </span>
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
            @click="handleEditArticle(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            :loading="loadingDeleteArticle"
            size="mini"
            type="danger"
            @click="handleDeleteArticle(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑文章" :visible.sync="dialogFormVisible" :before-close="handleClose" :destroy-on-close="true">
      <el-form ref="editorArticleForm" :model="editorArticleForm" :rules="editorArticleRules" label-width="120px" autocomplete="on" label-position="top">
        <el-form-item label="文章标题" prop="articleTitle">
          <el-input ref="articleTitle" v-model="editorArticleForm.articleTitle" />
        </el-form-item>
        <el-form-item label="文章作者" prop="articleCreatedBy">
          <el-select ref="articleCreatedBy" v-model="editorArticleForm.articleCreatedBy" placeholder="请选择">
            <el-option
              v-for="item in users"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章类型" prop="articleCategoryId">
          <el-select ref="articleCategoryId" v-model="editorArticleForm.articleCategoryId" placeholder="请选择">
            <el-option
              v-for="item in articleCategories"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="articleContent">
          <Editor
            ref="articleContent"
            v-model="editorArticleForm.articleContent"
            api-key="fq7y3tke9bonk5vpix4f63v9xxrthfrfg01t3tgxk2p102nn"
            :init="{
              height: 500,
              branding: false,
              language: 'zh_CN',
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
          <el-button :loading="loadingEditorSubmit" type="primary" @click.native.prevent="submitForm">提交</el-button>
          <el-button :loading="loadingEditorReset" @click.native.prevent="resetForm">重置</el-button>
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
        :loading="loadingBatchDeleteArticle"
        type="danger"
        @click="handleBatchDeleteArticle"
      >批量删除</el-button>
    </div>
  </div>
</template>
<script>
import Editor from '@tinymce/tinymce-vue'
import { getArticleInfo } from '@/api/article'
import { getArticleCategories } from '@/api/article'
import { getUsers } from '@/api/user'
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
      articleCategories: [],
      users: [],
      articleTableData: [],
      multipleSelectionArticle: [],
      loading: false,
      loadingEditor: false,
      loadingEditorSubmit: false,
      loadingEditorReset: false,
      loadingEditorCancel: false,
      loadingDeleteArticle: false,
      loadingBatchDeleteArticle: false,
      loadingArticleSearch: false,
      loadingArticleSearchAll: false,
      dialogFormVisible: false,
      editorArticleForm: {
        articleId: '',
        articleTitle: '',
        articleCreatedBy: '',
        articleCategoryId: '',
        articleContent: '',
        articleCreatedAt: ''
      },
      editorArticleRules: {
        articleTitle: [{ trigger: 'blur', validator: validateForm }],
        articleContent: [{ trigger: 'blur', validator: validateForm }]
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
    getArticleInfo().then((response) => {
      // this.articleTableData = response.data.items.records
      const newArticles = response.data.items.records.map(article => {
        const newArticle = { ...article }
        // //  ISO 字符串转换为 Date 对象
        // const date = new Date(newUser.userCreatedAt)
        // // 原生 JavaScript 方法进行格式化Date
        // newUser.userCreatedAt = this.formatDateWithSeconds(date)
        // // newUser.userCreatedAt = new Date(newUser.userCreatedAt)
        newArticle.articleCreatedAt = this.formatDateWithSeconds(new Date(newArticle.articleCreatedAt))
        newArticle.articleUpdatedAt = this.formatDateWithSeconds(new Date(newArticle.articleUpdatedAt))
        return newArticle
      })

      this.articleTableData = newArticles

      this.total = response.data.items.total

      this.pageSize = response.data.items.size

      this.isShow = true
    })
    getUsers().then((response) => {
      this.users = response.data.items
    })
    getArticleCategories().then((response) => {
      this.articleCategories = response.data.items
    })
  },
  methods: {
    formatDateWithSeconds(date) {
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      const hours = ('0' + date.getHours()).slice(-2)
      const minutes = ('0' + date.getMinutes()).slice(-2)
      const seconds = ('0' + date.getSeconds()).slice(-2)
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
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
    articleSearch() {
      this.loadingArticleSearch = true
      if (this.queryKeyword) {
        getArticleInfo(this.currentPage, this.queryKeyword).then((response) => {
          this.articleTableData = response.data.items.records
          this.total = response.data.items.total
          this.pageSize = response.data.items.size
        })
        this.$message({
          type: 'success',
          message: '查询成功!'
        })
        this.loadingArticleSearch = false
      } else {
        this.loadingArticleSearch = false
        this.$message({
          type: 'error',
          message: '查询条件不能为空'
        })
      }
    },
    articleSearchAll() {
      this.loadingArticleSearchAll = true
      getArticleInfo().then((response) => {
        this.articleTableData = response.data.items.records
        this.total = response.data.items.total
        this.pageSize = response.data.items.size
        this.queryKeyword = ''
        this.currentPage = 1
        this.$message({
          type: 'success',
          message: '查询成功!'
        })
      }).finally(() => {
        this.loadingArticleSearchAll = false
      })
    },
    handleSelectionChangeArticle(val) {
      this.multipleSelectionArticle = val
    },
    changePage(articlePageNum) {
      if (articlePageNum) {
        this.currentPage = articlePageNum
      }
      getArticleInfo(this.currentPage, this.queryKeyword).then((response) => {
        this.articleTableData = response.data.items.records
      })
    },
    handleEditArticle(index, row) {
      this.editorArticleForm = { ...row }
      this.loadingEditor = true
      this.dialogFormVisible = true
      const matchingUser = this.users.find(user => user.userName === row.userName)
      const matchingArticleCategories = this.articleCategories.find(articleCategorie => articleCategorie.categoryName === row.categoryName)
      if (matchingUser && matchingArticleCategories) {
        this.$set(this.editorArticleForm, 'articleCreatedBy', matchingUser.userId)
        this.$set(this.editorArticleForm, 'articleCategoryId', matchingArticleCategories.categoryId)
      } else {
        this.$message({
          type: 'error',
          message: '获取表格数据失败!'
        })
        this.editorArticleForm.articleCreatedBy = null
        this.editorArticleForm.articleCategoryId = null
        this.dialogFormVisible = false
        this.loadingEditor = false
      }
    },
    handleDeleteArticle(index, row) {
      this.loadingDeleteArticle = true
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('article/deleteArticle', row.articleId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadingDeleteArticle = false
          this.changePage()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          this.loadingDeleteArticle = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.loadingDeleteArticle = false
      })
    },
    handleBatchDeleteArticle() {
      const articleIdList = this.multipleSelectionArticle.map(item => item.articleId)
      this.loadingBatchDeleteArticle = true
      if (articleIdList.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选择要删除的文章!'
        })
        this.loadingBatchDeleteArticle = false
        return
      }
      this.$alert('此操作将永久删除文章信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('article/deleteBatchArticle', articleIdList).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadingBatchDeleteArticle = false
          this.changePage()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          this.loadingBatchDeleteArticle = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.loadingBatchDeleteArticle = false
      })
    },
    submitForm() {
      this.loadingEditorSubmit = true
      this.$confirm('确定提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.editorArticleForm.validate(valid => {
          if (valid) {
            this.editorArticleForm.articleUpdatedAt = this.getLocalISOTime()
            this.$store.dispatch('article/editorArticle', this.editorArticleForm).then(() => {
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
        this.$refs.editorArticleForm.resetFields()
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

<template>
  <div class="app-container">
    <el-form ref="addArticleForm" :model="addArticleForm" :rules="addArticleRules" label-width="120px" autocomplete="on" label-position="top">
      <el-form-item ref="articleTitle" label="文章标题" prop="articleTitle">
        <el-input v-model="addArticleForm.articleTitle" />
      </el-form-item>
      <el-form-item label="文章作者" prop="articleCreatedBy">
        <el-select ref="articleCreatedBy" v-model="addArticleForm.articleCreatedBy" placeholder="请选择">
          <el-option
            v-for="item in users"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章类型" prop="articleCategoryId">
        <el-select ref="articleCategoryId" v-model="addArticleForm.articleCategoryId" placeholder="请选择">
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
          v-model="addArticleForm.articleContent"
          api-key="fq7y3tke9bonk5vpix4f63v9xxrthfrfg01t3tgxk2p102nn"
          :init="{
            height: 500,
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
  </div>
</template>
<script >
import { getArticleCategories } from '@/api/article'
import { getUsers } from '@/api/user'
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
      articleCategories: [],
      users: [],
      addArticleForm: {
        articleTitle: '',
        articleCreatedBy: '',
        articleCategoryId: '',
        articleContent: '',
        articleCreatedAt: ''
      },
      addArticleRules: {
        articleTitle: [{ trigger: 'blur', validator: validateForm }],
        articleContent: [{ trigger: 'blur', validator: validateForm }]
      },
      loading: false,
      loadingReset: false
    }
  },
  created: function() {
    getUsers().then((response) => {
      this.users = response.data.items
    })
    getArticleCategories().then((response) => {
      this.articleCategories = response.data.items
    })
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
    submitForm() {
      this.loading = true
      this.$confirm('确定提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.addArticleForm.validate(valid => {
          if (valid) {
            this.addArticleForm.articleCreatedAt = this.getLocalISOTime()
            this.$store.dispatch('article/addArticle', this.addArticleForm).then(() => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message.error('提交文章信息错误，请重新输入')
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
        this.$refs.addArticleForm.resetFields()
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

</style>


<template>
  <div id="articlePage-container">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-table :data="articleTableData" border style="width: 100%;border-radius: 10px">
          <el-table-column label="推荐文章" width="873px">
            <template slot-scope="scope">
              <el-card class="card-in-table" shadow="always" style="border-radius: 10px" @click.native.prevent="goToArticleDetail(scope.row)">
                <div slot="header" class="clearfix">
                  <el-row :gutter="10">
                    <el-col :span="16"><span>{{ scope.row.articleTitle }}</span></el-col>
                    <el-col :span="4"><el-tag class="float-right"><svg-icon icon-class="like" />阅读次数：{{ scope.row.articleViews }}</el-tag></el-col>
                    <el-col :span="4"><el-tag class="float-right"><i class="el-icon-reading" />点赞次数： {{ scope.row.articleLikes }}</el-tag></el-col>
                  </el-row>
                </div>
                <el-row>
                  <el-col :span="24"><div class="limited-content" v-html="scope.row.articleContent" /></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><el-button type="text">{{ scope.row.categoryName }}</el-button></el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="21"><span>{{ scope.row.userName }}</span></el-col>
                  <el-col :span="3">{{ scope.row.articleUpdatedAt }}</el-col>
                </el-row>
              </el-card>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="isShow"
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          :current-page="currentPage"
          @current-change="changePage"
        />
      </el-col>
      <el-col :span="10">
        <el-table :data="articlesWithRank" style="width: 100%">
          <el-table-column prop="articleRank" label="排名" align="center" width="80" />
          <el-table-column prop="articleTitle" label="热门文章" width="440px">
            <template slot-scope="scope">
              <el-row :gutter="10">
                <el-col :span="24" class="limited-title"><span>{{ scope.row.articleTitle }}</span></el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="articleHeat" label="热度" align="center" width="90">
            <template slot-scope="scope">
              <span style="margin-left: 10px;"> {{ scope.row.articleHeat }} </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getArticlePageInfo, getArticleHeat } from '@/api/article'
export default {
  data() {
    return {
      articleTableData: [],
      articleHeatTableData: [],
      currentPage: 1,
      total: 1,
      pageSize: 1,
      isShow: false
    }
  },
  computed: {
    articlesWithRank() {
      return this.articleHeatTableData.map((article, index) => ({
        ...article,
        articleRank: this.oOrdinal(index + 1)
      }))
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
    getArticlePageInfo().then((response) => {
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
    getArticleHeat().then((res) => {
      this.articleHeatTableData = res.data.items
    })
  },
  methods: {
    oOrdinal(num) {
      const suffixes = ['st', 'nd', 'rd', 'th']
      const val = num % 10
      return num + (val === 1 || val === 2 || val === 3 ? suffixes[val - 1] : suffixes[3])
    },
    formatDateWithSeconds(date) {
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      return `${year}-${month}-${day}`
    },
    changePage(articlePageNum) {
      if (articlePageNum) {
        this.currentPage = articlePageNum
      }
      getArticlePageInfo(this.currentPage, this.queryKeyword).then((response) => {
        this.articleTableData = response.data.items.records
      })
    },
    goToArticleDetail(article) {
      this.$router.push(`/articlePage/detail/` + article.articleId)
      // this.$router.push({ name: 'articleDetail', params: { id: article.articleId }})
    }
  }
}
</script>

<style scoped>
.card-in-table {
  /* 根据需要调整卡片在表格中的样式 */
  margin: 0;
  border-radius: 0;
  box-shadow: none;
}
.float-right {
  float: right;
}
.limited-content {
  max-height: 200px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
.limited-content::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0),rgba(255,255,255,1) 50%);
  pointer-events: none;
}
.limited-title {
  max-height: 50px;
  /* 确保内容不会换行，这样才能正确显示省略号 */
  white-space: nowrap;
  /* 隐藏溢出的内容 */
  overflow: hidden;
  /* 在溢出的内容处显示省略号 */
  text-overflow: ellipsis;
}
</style>

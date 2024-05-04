<template>
  <div id="personal-container">
    <el-row>
      <el-col :span="19" style="display: flex;" :offset="1"><strong style="height: 60px; line-height: 60px;">个人中心</strong></el-col>
      <el-col :span="2" style="display: flex; justify-content: center;">
        <!-- <span style="height: 60px; line-height: 60px;" @click.native.prevent="goToHomePage">首页</span> -->
        <el-button type="text" class="homePage" @click.native.prevent="goToHomePage">首页</el-button>
      </el-col>
      <el-col :span="2">
        <el-dropdown trigger="hover">
          <div class="menu">
            <div class="avatar-wrapper">
              <!-- <img :src="getFullImageUrl(userAvatar)" class="user-avatar"> -->
              <img :src="userAvatar" class="user-avatar">
            </div>
            <span style="margin-left: 10px;height: 60px; line-height: 60px;font-weight: bold;">{{ userName }}</span>
          </div>
          <el-dropdown-menu>
            <el-dropdown-item @click.native="Settings">
              <span style="display:block;">账号设置</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="width: 100%;">
      <el-col :span="4" :offset="2">
        <el-card shadow="always" class="box-card">
          <el-row>
            <el-col :span="24">
              <div style="display: flex;justify-content: center;">
                <!-- <img :src="getFullImageUrl(userAvatar)" class="user-avatar"> -->
                <img :src="userAvatar" style="max-height: 100px;max-width: 100px;border-radius: 10px;">
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="display: flex;justify-content: center;">
              <span>{{ userName }}</span>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="24" style="display: flex;justify-content: center;">
                  <strong>{{ favoriteArticlesCount }}</strong>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style="display: flex;justify-content: center;">
                  <span>点赞的文章</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="24" style="display: flex;justify-content: center;">
                  <strong>{{ followedDisastersCount }}</strong>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style="display: flex;justify-content: center;">
                  <span>关注的事件</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="always" class="box-card">
          <el-table :data="favoriteArticlesTableData" style="width: 100%;">
            <el-table-column label="点赞的文章" width="568px">
              <template slot-scope="scope">
                <el-card class="card-in-table" shadow="always" style="border-radius: 10px" @click.native.prevent="goToArticleDetail(scope.row)">
                  <div slot="header" class="clearfix">
                    <strong>{{ scope.row.articleTitle }}</strong>
                  </div>
                  <el-row>
                    <el-col :span="24">{{ scope.row.favoriteCreatedAt }}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24"><div class="limited-content" v-html="scope.row.articleContent" /></el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24"><el-button type="text">{{ scope.row.categoryName }}</el-button></el-col>
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
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card shadow="always" class="box-card">
          <el-table :data="articlesWithRank" style="width: 100%">
            <el-table-column prop="articleRank" label="排名" align="center" width="80" />
            <el-table-column prop="articleTitle" label="热门文章" width="174px">
              <template slot-scope="scope">
                <el-row :gutter="10" @click.native.prevent="goToArticleDetail(scope.row)">
                  <el-col :span="24" class="limited-title"><span>{{ scope.row.articleTitle }}</span></el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFavoriteArticlesCount, getFollowedDisastersCount, getUserFavoriteArticles } from '@/api/user'
import { getArticleHeat } from '@/api/article'
export default {
  name: 'Personal',

  data() {
    return {
      favoriteArticlesCount: null,
      followedDisastersCount: null,
      favoriteArticlesTableData: [],
      articleHeatTableData: [],
      currentPage: 1,
      total: 1,
      pageSize: 1,
      isShow: false
    }
  },
  computed: {
    ...mapGetters([
      'userName',
      'userRole',
      'userAvatar'
    ]),
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
  mounted() {

  },
  created: function() {
    getFavoriteArticlesCount(this.userName).then((res) => {
      this.favoriteArticlesCount = res.data.favoriteArticlesCount
    })
    getFollowedDisastersCount(this.userName).then((res) => {
      this.followedDisastersCount = res.data.followedDisastersCount
    })
    getUserFavoriteArticles(this.userName).then((res) => {
      // this.favoriteArticlesTableData = res.data.items.records

      const newArticles = res.data.items.records.map(article => {
        const newArticle = { ...article }
        // //  ISO 字符串转换为 Date 对象
        // const date = new Date(newUser.userCreatedAt)
        // // 原生 JavaScript 方法进行格式化Date
        // newUser.userCreatedAt = this.formatDateWithSeconds(date)
        // // newUser.userCreatedAt = new Date(newUser.userCreatedAt)
        newArticle.favoriteCreatedAt = this.formatDateWithSeconds(new Date(newArticle.favoriteCreatedAt))
        return newArticle
      })

      this.favoriteArticlesTableData = newArticles

      this.total = res.data.items.total

      this.pageSize = res.data.items.size

      this.isShow = true
    })
    getArticleHeat().then((res) => {
      this.articleHeatTableData = res.data.items
    })
  },
  methods: {
    formatDateWithSeconds(date) {
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      return `${year}-${month}-${day}`
    },
    oOrdinal(num) {
      const suffixes = ['st', 'nd', 'rd', 'th']
      const val = num % 10
      return num + (val === 1 || val === 2 || val === 3 ? suffixes[val - 1] : suffixes[3])
    },
    changePage(userFavoriteArticlesPageNum) {
      if (userFavoriteArticlesPageNum) {
        this.currentPage = userFavoriteArticlesPageNum
      }
      getUserFavoriteArticles(this.userName, this.currentPage).then((response) => {
        this.favoriteArticlesTableData = response.data.items.records
      })
    },
    goToArticleDetail(article) {
      this.$router.push(`/articlePage/detail/` + article.articleId)
      // this.$router.push({ name: 'articleDetail', params: { id: article.articleId }})
    },
    async goToHomePage() {
      if (this.userRole === 'user') {
        this.$router.push(`/homepage/index`)
      } else {
        this.$router.push(`/`)
      }
    },
    async Settings() {
      this.$router.push('/accountSettings')
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
.avatar-wrapper {
  margin-top: 5px;
  position: flex;

  .user-avatar {
    cursor: pointer;
    max-width: 40px;
    max-height: 40px;
    width: auto;
    height: auto;
    border-radius: 10px;
  }

}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }

.box-card{
  border-radius: 10px;
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

.clearfix{
  /* 设置标题容器的宽度，确保它不会无限扩展 */
  width: 100%; /* 或者设置一个具体的像素值，比如 200px */
  /* 防止文本换行 */
  white-space: nowrap;
  /* 超出容器宽度的文本用省略号表示 */
  overflow: hidden;
  text-overflow: ellipsis;
}

.homePage{
  height: 30px;
  line-height: 30px;
  color: black ;
  display: flex;
  justify-content: center;
  font-weight: bold;
}

.menu {
  display: flex;
  justify-content: center;
}

.menu:hover {
  color: #409EFF;
}
</style>

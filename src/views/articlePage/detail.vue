<template>
  <div id="articleDetail-container">
    <el-card class="box-card" style="border-radius: 10px">
      <el-row>
        <el-col :span="12">
          <strong>{{ articleDetailVo.articleTitle }}:</strong>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="min-height: 431px;" v-html="articleDetailVo.articleContent" /> <!-- 使用v-html来渲染长文本内容 -->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <strong>{{ articleDetailVo.categoryName }}</strong>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <strong>上传时间：</strong> {{ articleDetailVo.articleCreatedAt }}
        </el-col>
        <el-col :span="4">
          <strong>最后更新时间：</strong> {{ articleDetailVo.articleUpdatedAt }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1">
          <div class="avatar-wrapper">
            <!-- <img :src="getFullImageUrl(userAvatar)" class="user-avatar"> -->
            <img :src="userAvatar" class="user-avatar">
          </div>
        </el-col>
        <el-col :span="19">
          <strong style="height: 30px; line-height: 55px;">
            {{ articleDetailVo.userName }}
          </strong>
        </el-col>
        <el-col :span="2" style="height: 30px; line-height: 80px;">
          <i class="el-icon-reading" /> {{ articleDetailVo.articleViews }}
        </el-col>
        <el-col :span="2" style="height: 30px; line-height: 80px;">
          <!-- <svg-icon :icon-class="isLiked? 'likes-active' : 'likes'" @click.native.prevent="likeArticle" /> -->
          <svg-icon :icon-class="articleDetailVo.favoriteStatus? 'likes-active' : 'likes'" @click.native.prevent="likeArticle" />
          {{ articleDetailVo.articleLikes }}
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getArticleDetail } from '@/api/article'
export default {
  name: 'ArticleDetail',
  data() {
    return {
      articleDetailVo: []
    }
  },
  computed: {
    ...mapGetters([
      'userName',
      'userAvatar',
      'isLiked'
    ])
  },
  mounted() {
    // this.increaseArticleViews(this.$route.params.id)
    window.addEventListener('scroll', this.handleScroll)
    this.checkAndIncreaseViews() // 页面加载时检查并增加阅读量
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    this.fetchArticleDetail()
  },
  methods: {
    fetchArticleDetail() {
      const id = this.$route.params.id
      getArticleDetail(id, this.userName).then(res => {
        const newArticle = res.data.articleDetailVo
        newArticle.articleCreatedAt = this.formatDateWithSeconds(new Date(newArticle.articleCreatedAt))
        newArticle.articleUpdatedAt = this.formatDateWithSeconds(new Date(newArticle.articleUpdatedAt))
        this.articleDetailVo = newArticle
      }).catch(error => {
        console.log(error)
      })
    },
    formatDateWithSeconds(date) {
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      return `${year}-${month}-${day}`
    },
    likeArticle() {
      if (this.userName) {
        const articleId = this.articleDetailVo.articleId
        if (this.articleDetailVo.favoriteStatus) {
          this.decreaseLikes(articleId, this.userName)
        } else {
          this.increaseLikes(articleId, this.userName)
        }
      } else {
        this.$store.dispatch('user/remove')
        this.$router.push(`/login`)
      }
    },
    increaseArticleViews(articleId) {
      this.$store.dispatch('article/increaseArticleViews', articleId).then(() => {
        this.fetchArticleDetail()
      }).catch(error => {
        console.log(error)
      })
    },
    handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      if (scrollTop + clientHeight >= scrollHeight) {
        // this.increaseArticleViews(this.$route.params.id)
        this.checkAndIncreaseViews()
      }
    },
    checkAndIncreaseViews() {
      const currentDate = new Date()
      const currentUTCDateStr = currentDate.toISOString().split('T')[0] // 获取当前UTC日期字符串

      // 构造localStorage的键，使用文章ID加上日期前缀
      const storageKey = `lastViewIncreaseDate_${this.$route.params.id}`
      const lastViewIncreaseDateStr = localStorage.getItem(storageKey)

      if (!lastViewIncreaseDateStr || lastViewIncreaseDateStr !== currentUTCDateStr) {
        // 如果上次增加阅读量的日期为空，或者与当前UTC日期不同
        this.increaseArticleViews(this.$route.params.id)
        localStorage.setItem(storageKey, currentUTCDateStr) // 更新localStorage中的日期
      }
    },
    decreaseLikes(articleId, userName) {
      const likeData = {
        articleId: articleId,
        userName: userName
      }
      this.$store.dispatch('article/decreaseArticleLikes', likeData).then(() => {
        this.fetchArticleDetail()
      }).catch(error => {
        console.log(error)
      })
    },
    increaseLikes(articleId, userName) {
      const likeData = {
        articleId: articleId,
        userName: userName
      }
      this.$store.dispatch('article/increaseArticleLikes', likeData).then(() => {
        this.fetchArticleDetail()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

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
</style>

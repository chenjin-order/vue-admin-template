<template>
  <div id="homepage-container">
    <el-row>
      <el-col :span="22" :offset="1">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-carousel trigger="click" height="310px" style="border-radius: 10px;">
              <el-carousel-item v-for="(item, index) in images" :key="index" style="border-radius: 10px;">
                <el-image :src="item.image" :alt="item.description" style="border-radius: 10px;" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col v-for="(item, index) in articleData" :key="index" :span="5">
            <el-card class="box-card" @click.native.prevent="goToArticleDetail(item.articleId)">
              <div slot="header" class="clearfix">
                <span>{{ item.articleTitle }}</span>
              </div>
              <el-row>
                <el-col :span="24"><div class="limited-content" v-html="item.articleContent" /></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="14">
                  <span class="small-font">
                    {{ item.userName }}
                  </span>
                </el-col>
                <el-col :span="10" class="small-font">{{ item.articleUpdatedAt }}</el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <div
          v-infinite-scroll="load"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"
          infinite-scroll-immediate="false"
          class="infinite-scroll"
        >
          <el-row :gutter="20">
            <el-col v-for="(item, index) in eventData" :key="index" :span="5">
              <el-card class="box-card" @click.native.prevent="goToEventDetail(item.eventId)">
                <div slot="header" class="clearfix">
                  <span>{{ item.eventName }}</span>
                </div>
                <el-row>
                  <el-col :span="24" style="height: 140px;">
                    <div style="height: 100%;width: 100%;">
                      <el-image :src="item.eventImageUrl" fit="contain" lazy />
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-row>
                      <el-col :span="17">
                        <span class="small-font">
                          {{ item.typeName }}
                        </span>
                      </el-col>
                      <el-col :span="7" class="small-font">{{ item.eventEndDate }}</el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div v-if="busy" class="loading-more">
                加载中...
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getHomeArticleInfo } from '@/api/article'
import { getHomeEventInfo } from '@/api/event'
export default {
  name: 'Homepage',
  data() {
    return {
      activeIndex: '1',
      images: [
        { image: require('@/assets/images/811c7d37e08d11b5a54c7c01ebe6195a.jpg'), description: 'Image1' },
        { image: require('@/assets/images/4988bed93b5f6390bb8c4d76a599b74f.jpeg'), description: 'Image1' },
        { image: require('@/assets/images/aea4b53d78481219373dc21429b99192.jpeg'), description: 'Image1' },
        { image: require('@/assets/images/b1816470784e042cd5c742cef1abdf11.jpeg'), description: 'Image1' }
      ],
      articleData: [],
      eventData: [],
      busy: false,
      homeEventPageNum: 0
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userAvatar'
    ])
  },
  created: function() {
    getHomeArticleInfo().then((res) => {
      const newArticles = res.data.homeArticleVoList.map(article => {
        const newArticle = { ...article }
        newArticle.articleUpdatedAt = this.formatDateWithSeconds(new Date(newArticle.articleUpdatedAt))
        return newArticle
      })
      this.articleData = newArticles
    })
  },
  mounted() {
    this.load()
    window.addEventListener('scroll', this.checkScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.checkScroll)
  },
  methods: {
    checkScroll() {
      const scrollDistance = window.innerHeight - window.scrollY
      if (scrollDistance < 10) {
        this.load()
      }
    },
    load() {
      this.busy = true
      getHomeEventInfo(++this.homeEventPageNum).then((res) => {
        if (res.code === 20000) {
          this.eventData = this.eventData.concat(res.data.items.records)
        }
        this.busy = false
      })
    },
    formatDateWithSeconds(date) {
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      return `${year}-${month}-${day}`
    },
    goToArticleDetail(articleId) {
      this.$router.push(`/articlePage/detail/` + articleId)
      // this.$router.push({ name: 'articleDetail', params: { id: article.articleId }})
    },
    goToEventDetail(eventId) {
      this.$router.push(`/eventPage/detail/` + eventId)
    }
  }
}
</script>
<style lang="scss" scoped>
  #homepage-container{
    width: 100%;
    height: 100%;
  }
  .carousel .el-carousel__item{
    border-radius: 10px;
    overflow: hidden;
  }
  .carousel .el-carousel__item .el-img{
    border-radius: 10px;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .el-carousel__item:nth-child(2n) {
    border-radius: 10px;
  }

  .el-carousel__item:nth-child(2n+1) {
    border-radius: 10px;
  }
  .infinite-scroll {
    min-height: 2000px;
    overflow: auto;
  }
  .box-card {
    margin-bottom: 10px;
    border: 1px solid #d7dde4;
    border-radius: 10px;
    background-color: #fff;
    overflow: hidden;
  }
  .el-col-9 {
    width: 40%;
  }
  .el-col-5 {
    width: 20%;
  }
  .clearfix {
    white-space: nowrap;
    /* 当内容溢出容器时，显示省略号 */
    text-overflow: ellipsis;
    /* 隐藏溢出容器的内容 */
    overflow: hidden;
    /* 设置容器的宽度，或者使用其他方式来确保容器宽度是有限的 */
    width: auto; /* 或者具体的像素值，如 200px */
    /* 可选：设置字体大小和行高以优化显示效果 */
    font-size: 16px;
    line-height: 1.5;
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
  .small-font{
    font-size: 12px;
  }
  .limited-content::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: auto;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0),rgba(255,255,255,1) 50%);
    pointer-events: none;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          max-width: 40px;
          max-height: 40px;
          width: auto;
          height: auto;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>

<template>
  <div id="homepage-container">
    <el-row class="menu">
      <el-col :span="23">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">科普文章</el-menu-item>
          <el-menu-item index="3">灾害事件</el-menu-item>
          <el-menu-item index="4">灾害应对措施</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="1">
        <div class="right-menu">
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <!-- <img :src="getFullImageUrl(userAvatar)" class="user-avatar"> -->
              <img :src="userAvatar" class="user-avatar">
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <router-link to="/">
                <el-dropdown-item>
                  Home
                </el-dropdown-item>
              </router-link>
              <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
                <el-dropdown-item>Github</el-dropdown-item>
              </a>
              <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
                <el-dropdown-item>Docs</el-dropdown-item>
              </a> -->
              <el-dropdown-item divided @click.native="logout">
                <span style="display:block;">Log Out</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <el-row class="carousel">
      <el-col :span="24">
        <el-carousel trigger="click" indicator-position="outside" height="550px">
          <el-carousel-item v-for="(item, index) in images" :key="index">
            <!-- <h3 class="small">{{ item }}</h3> -->
            <img :src="item.image" :alt="item.description" style="width: 100%; height: 100%; object-fit: cover;">
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      ]
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userAvatar'
    ])
  },
  mounted() {

  },

  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      const homepagePath = this.$route.fullPath
      const path = ''
      if (homepagePath === '/homepage') {
        this.$router.push(`/login?redirect=${path}`)
      } else {
        console.log(homepagePath)
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 450px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
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

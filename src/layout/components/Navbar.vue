<template>
  <div class="navbar">
    <hamburger v-if="userRole === 'admin'" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb v-if="userRole === 'admin'" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="getFullImageUrl(userAvatar)" class="user-avatar"> -->
          <img :src="userAvatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link> -->
          <el-dropdown-item @click.native="goToHomePage">
            <span style="display:block;">首页</span>
          </el-dropdown-item>
          <!-- <el-dropdown-item divided @click.native="personal">
            <span style="display:block;">个人中心</span>
          </el-dropdown-item> -->
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <!-- <el-dropdown-item divided @click.native="signup">
            <span style="display:block;">注册</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userAvatar',
      'userRole'
    ])
  },
  methods: {
    // getFullImageUrl(relativePath) {
    //   const baseUrl = 'http://192.168.216.129:8080/'
    //   // 构建完整的图片 URL
    //   return baseUrl + relativePath
    // },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async goToHomePage() {
      if (this.userRole === 'user') {
        this.$store.dispatch('permission/reversalRoutes')
        this.$router.push(`/homepage/index`)
      } else {
        this.$router.push(`/`)
      }
    },
    async personal() {
      this.$router.push('/personal')
    },
    async signup() {
      await this.$store.dispatch('user/remove')
      this.$router.push(`/signup`)
    },
    async logout() {
      if (this.userRole === 'user') {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=`)
      } else {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
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
}
</style>

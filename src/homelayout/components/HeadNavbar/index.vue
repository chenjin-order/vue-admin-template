<template>
  <div :class="{'has-logo':showLogo}">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      > -->
    <el-row>
      <el-col :span="22">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-demo"
          active-text-color="#409EFF"
          mode="horizontal"
        >
          <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
        </el-menu>
      </el-col>
      <el-col :span="2">
        <div v-if="userAvatar" class="right-menu">
          <el-dropdown class="avatar-container" trigger="hover">
            <div class="avatar-wrapper">
              <!-- <img :src="getFullImageUrl(userAvatar)" class="user-avatar"> -->
              <img :src="userAvatar" class="user-avatar">
              <!-- <i class="el-icon-caret-bottom" /> -->
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <!-- <router-link to="/homepage/index">
                <el-dropdown-item>
                  首页
                </el-dropdown-item>
              </router-link> -->
              <el-dropdown-item @click.native="personal">
                <span style="display:block;">个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="Settings">
                <span style="display:block;">账号设置</span>
              </el-dropdown-item>
              <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
                <el-dropdown-item>Github</el-dropdown-item>
              </a>
              <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
                <el-dropdown-item>Docs</el-dropdown-item>
              </a> -->
              <!-- <el-dropdown-item @click.native="signup">
                <span style="display:block;">注册</span>
              </el-dropdown-item> -->
              <el-dropdown-item @click.native="logout">
                <span style="display:block;">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-else>
          <el-row style="height: 50px; line-height: 50px;">
            <el-col :span="15"><el-button type="primary" round @click.native="login">登录</el-button></el-col>
            <el-col :span="9"><el-button type="text" @click.native="signup"><strong>注册</strong></el-button></el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- </el-scrollbar> -->

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar',
      'topbar',
      'userAvatar'
    ]),
    // routes() {
    //   return this.$router.options.routes
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    async login() {
      await this.$store.dispatch('user/remove')
      this.$router.push(`/login`)
    },
    async signup() {
      await this.$store.dispatch('user/remove')
      this.$router.push(`/signup`)
    },
    async personal() {
      this.$router.push('/personal')
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
        position: flex;

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

<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <!-- <sidebar class="sidebar-container" /> -->
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <!-- <navbar /> -->
        <head-navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { HeadNavbar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
// import Hamburger from '@/components/Hamburger'
export default {
  name: 'Layout',
  components: {
    // Navbar,
    // Sidebar,
    HeadNavbar,
    AppMain
    // Hamburger
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    topbar() {
      return this.$store.state.app.topbar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideTopbar: this.topbar.opened,
        // openSidebar: this.sidebar.opened,
        withoutAnimation: this.topbar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    'topbar.opened': function(newVal, oldVal) {
      if (newVal === false && oldVal !== newVal) {
        this.toggleSideBar()
      }
    }
  },
  mounted() {
    this.toggleSideBar()
  },
  methods: {
    toggleSideBar() {
      if (!this.topbar.opened) {
        this.$store.dispatch('app/toggleTopBar')
      }
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$topBarWidth});
    transition: width 0.28s;
  }

  .hideTopbar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>

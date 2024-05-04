<template>
  <div id="account-setting-container">
    <el-row type="flex">
      <el-col :span="15" :offset="1">
        <el-card class="box-card">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card class="box-card" shadow="hover" @click.native.prevent="gotoPhoneSet">
                <div>
                  <el-row>
                    <el-col :span="24">
                      <span class="selected">
                        <svg-icon :icon-class="phoneIconClass" />
                        我的手机
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-button type="text">去查看<i class="el-icon-arrow-right" /></el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="box-card" shadow="hover" @click.native.prevent="gotoEmailSet">
                <div>
                  <el-row>
                    <el-col :span="24">
                      <span class="selected">
                        <svg-icon :icon-class="emailIconClass" />
                        我的邮箱
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-button type="text">去查看<i class="el-icon-arrow-right" /></el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="box-card" shadow="hover" @click.native.prevent="gotoPWSet">
                <div>
                  <el-row>
                    <el-col :span="24">
                      <span class="selected">
                        <svg-icon :icon-class="pwIconClass" />
                        我的账号密码
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-button type="text">去查看<i class="el-icon-arrow-right" /></el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="7" :offset="1">
        <el-card class="box-card">
          <div style="height: 80vh;">
            <el-row>
              <el-col :span="24">
                <div class="card-container">
                  <img :src="userAvatar" class="avatar-img">
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="card-container">
                  <span style="font-size: large;font-weight: bolder;">{{ userName }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
Cookies
export default {

  data() {
    return {
      settingsUsersInfoVo: []
    }
  },
  computed: {
    ...mapGetters([
      'userName',
      'userRole',
      'userAvatar'
    ]),
    phoneIconClass() {
      const userPhone = this.settingsUsersInfoVo.userPhone
      // 根据userPhone是否为空返回不同的图标类名
      return userPhone ? 'success' : 'warning'
    },
    emailIconClass() {
      const userEmail = this.settingsUsersInfoVo.userEmail
      // 根据userPhone是否为空返回不同的图标类名
      return userEmail ? 'success' : 'warning'
    },
    pwIconClass() {
      const hasPassword = this.settingsUsersInfoVo.hasPassword
      // 根据userPhone是否为空返回不同的图标类名
      return hasPassword === 1 ? 'success' : 'warning'
    }
  },
  beforeCreate() {
    if (Cookies.get('sidebarStatus') === '0') {
      this.$store.dispatch('app/toggleSideBar')
    }
  },
  mounted() {
    this.getUserInfo()
  },

  methods: {
    getUserInfo() {
      this.$store.dispatch('user/getUserInfo').then((res) => {
        this.settingsUsersInfoVo = res.settingsUsersInfoVo
      }).catch(() => {
        console.log('failed')
      })
    },
    async gotoPhoneSet() {
      this.$router.push(`/phoneSettings`)
    },
    async gotoEmailSet() {
      this.$router.push(`/emailSettings`)
    },
    async gotoPWSet() {
      this.$router.push(`/passwordSettings`)
    }
  }
}
</script>

<style lang="scss" scoped>
.selected{
  color: #000;
  font-size: larger;
  font-weight: bold;
}

.unselected{
  color: #888;
}

.el-button--text{
  color: #adaaaa;
}

.el-button--text:hover{
  color: #888;
}

.box-card{
  border-radius: 10px;
}

.card-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  border-radius: 10px;
}

.avatar-img {
  max-width: 50%; /* 根据父元素宽度缩放 */
  height: auto; /* 保持原始纵横比 */
  border-radius: 10px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col{
  margin-top: 10px;
  border-radius: 10px;
}
</style>

const getters = {
  sidebar: state => state.app.sidebar,
  topbar: state => state.app.topbar,
  isLiked: state => state.article.isLiked,
  device: state => state.app.device,
  token: state => state.user.token,
  userAvatar: state => state.user.userAvatar,
  userName: state => state.user.userName,
  userRole: state => state.user.userRole,
  permission_routes: state => state.permission.routes
}
export default getters

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userAvatar: state => state.user.userAvatar,
  userName: state => state.user.userName
}
export default getters

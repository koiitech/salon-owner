export const state = () => ({
  user: null,
  token: null
})

export const mutations = {
  user(state, user) {
    state.user = Object.assign({}, user)
  },
  token(state, token) {
    state.token = Object.assign({}, token)
  },
}

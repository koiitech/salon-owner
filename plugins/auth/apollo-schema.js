import loginMutation from "~/graphql/mutations/login.gql";
import getMeQuery from "~/graphql/queries/getMe.gql";

export default class ApolloScheme {
  constructor(auth, options) {
    this.$auth = auth
    this.$apollo = auth.ctx.app.apolloProvider.defaultClient
    this.$apolloHelpers = auth.ctx.app.$apolloHelpers

    this.options = Object.assign({
      returnSecureToken: true
    }, options)

  }

  create() {

    if (this.check()) {
      this.fetchUser()
    }
  }
  check() {
    return !!this.$apolloHelpers.getToken()
  }

  async login({ data, mutationKey = 'login', tokenKey = 'token', userKey = 'user' }) {

    const result = await this.$apollo
      .mutate({
        mutation: loginMutation,
        variables: data,
      })
      .then(({ data }) => data[mutationKey])
      .catch((error) => {
        console.error(error)
      })

    const token = tokenKey.split('.').reduce((items, item) => items[item], result)
    const user = userKey.split('.').reduce((items, item) => items[item], result)
    this.setUser(user)
    this.setToken(token)
    // this.auth.fetchUser(data)

    return this.$apolloHelpers.onLogin(token)
  }

  async setToken(tokenValue) {
    return this.$apolloHelpers.onLogin(tokenValue)
  }

  async setUser(userValue) {
    this.$auth.setUser(userValue)
  }

  async setUserToken(tokenValue) {
    this.setToken(tokenValue).then(() => this.fetchUser())
    return this.fetchUser()
  }

  async fetchUser() {
    if (!this.check()) {
      return
    }

    return this.$apollo.query({ query: getMeQuery }).then(({ data: { me } }) => this.setUser(me))
      .catch(error => {
        console.log(error);
      });
  }

  async logout() {
    await this.$apolloHelpers.onLogout()
    return this.reset()
  }

  async reset() {
    this.setUser(false)
    this.setToken(null)

    return Promise.resolve()
  }
}

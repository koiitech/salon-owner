<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="4" sm="8">
        <v-card>
          <v-form @submit.prevent="login">
            <v-card-title class="mb-12 display-2 justify-center text-uppercase"
              >Đăng nhập</v-card-title
            >
            <v-card-text>
              <v-text-field
                flat
                label="Email"
                solo
                type="text"
                v-model="email"
                @keypress.enter="login"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="mr-3" color="grey">mdi-account</v-icon>
                </template>
              </v-text-field>
              <v-text-field
                @keypress.enter="login"
                flat
                label="Password"
                solo
                type="password"
                v-model="password"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="mr-3" color="grey">mdi-lock</v-icon>
                </template>
              </v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn text>Quên mật khẩu</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="px-10"
                rounded
                :loading="$nuxt.$loading && $nuxt.$loading.show"
                type="submit"
                x-large
                >Đăng nhập</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import loginMutation from '~/graphql/mutations/login.gql'

export default {
  layout: 'blank',
  auth: false,
  data() {
    return {
      email: 'admin@gmail.com',
      password: '123456',
    }
  },
  created() {
    console.log(this.$apolloHelpers.getToken())
  },
  methods: {
    login() {
      this.$auth
        .loginWith('apollo', {
          loginMutation: loginMutation,
          data: {
            email: this.email,
            password: this.password,
          },
          tokenKey: 'token.access_token',
        })
        .then(() =>
          // window.location.href = '/'
          this.$router.replace({ name: 'index' })
        )
      // this.$apollo
      //   .mutate({
      //     mutation: loginMutation,
      //     variables: {
      //       email: this.email,
      //       password: this.password,
      //     },
      //   })
      //   .then(({ data }) => {
      //     this.$store.commit('auth/user', data.login.user)
      //     this.$apolloHelpers
      //       .onLogin(data.login.token.access_token)
      //       .then(() => {
      //         this.$router.push({ name: 'index' })
      //       })
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //   })
    },
  },
  mounted() {
    // console.log(this.$auth);
  },
}
</script>

<style></style>

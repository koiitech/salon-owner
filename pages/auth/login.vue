<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="4" sm="8">
        <v-card>
          <v-form @submit.prevent="login">
            <v-card-title class="mb-12 display-2 justify-center text-uppercase">Đăng nhập</v-card-title>
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
              >Đăng nhập</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
export default {
  layout:'blank',
  // middleware: 'notAuthenticated',

  data() {
    return {
      email: 'admin@gmail.com',
      password: '123456'
    }
  },
  computed: {
    formdata() {
      return {
        email: this.email,
        password: this.password
      }
    }
  },
  methods: {
    login() {
     this.$apollo.mutate({
      // Query
      mutation: gql`mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token {
            access_token
          }
          user {
            id
            name
            email
          }
        }
      }`,
      variables: this.formdata,  
    }).then(({ data }) => {
      
      this.$store.commit('auth/token', data.login.token)
      this.$store.commit('auth/user', data.login.user)
      this.$router.push({name: 'index'})
    }).catch((error) => {
      console.error(error)
    })
    }
  }
}
</script>

<style></style>

<template>
  <v-card>
    <v-form @submit.prevent="login">
      <v-img class="align-end" :aspect-ratio="16 / 9" :src="brand.conver">
        <v-avatar>
          <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
        </v-avatar>
        <v-card-title>Top 10 Australian beaches</v-card-title>
      </v-img>
      <v-card-title class="mb-12 display-2 justify-center text-uppercase"
        >Đăng nhập</v-card-title
      >
      <!-- <v-card-text>
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
      </v-card-actions> -->
    </v-form>
  </v-card>
</template>

<script>
export default {
  apollo: {
    brand: {
      query: gql`
        query GetBrand($id: ID!) {
          brand(id: $id) {
            id
            name
            address
            convert
            logo
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
    },
  },
  data: () => ({
    brand: {},
  }),
  methods: {
    editBrand() {
      this.$router.push({
        name: 'brands-detail',
        params: { id: this.brand.id },
      })
    },
    login() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation Login($email: String!, $password: String!) {
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
            }
          `,
          variables: this.formdata,
        })
        .then(({ data }) => {
          this.$store.commit('auth/token', data.login.token)
          this.$store.commit('auth/user', data.login.user)
          this.$router.push({ name: 'index' })
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
}
</script>

<style></style>

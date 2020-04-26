<template>
  <v-card>
    <v-form @submit.prevent="save">
      <v-img
        class="align-end justify-center"
        :aspect-ratio="16 / 9"
        :src="brand.cover"
      >
        <v-row align="center" justify="center">
          <v-avatar size="150" class="mb-5">
            <v-btn color="pink" dark small absolute bottom fab>
              <v-icon>mdi-camera</v-icon>
            </v-btn>
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
          </v-avatar>
        </v-row>
        <v-btn
          color="pink"
          dark
          small
          absolute
          top
          right
          fab
          style="top: 20px;"
        >
          <v-icon>mdi-camera</v-icon>
        </v-btn>
      </v-img>

      <v-card-text>
        <v-text-field label="Tên salon" type="text" v-model="brand.name">
        </v-text-field>
        <v-text-field label="Mô tả" type="text" v-model="brand.description">
        </v-text-field>
        <v-text-field label="Địa chỉ" type="text" v-model="brand.address">
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" :loading="$apollo.loading" type="submit"
          >Lưu</v-btn
        >
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    brand: {
      query: gql`
        query GetBrand($id: ID!) {
          brand(id: $id) {
            id
            name
            description
            cover
            logo
            address
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
      skip() {
        return !!!this.$route.params.id
      },
    },
  },
  data: () => ({
    brand: {},
  }),
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation UpdateBrand(
              $id: ID!
              $name: String!
              $description: String
              $logo: String
              $cover: String
              $address: String
            ) {
              updateBrand(
                id: $id
                name: $name
                user_id: "1a82e676-2b3f-48e3-b785-546dc2643d28"
                description: $description
                logo: $logo
                cover: $cover
                address: $address
              ) {
                id
                name
                description
                cover
                logo
                address
              }
            }
          `,
          variables: {
            id: this.brand.id,
            name: this.brand.name,
            description: this.brand.description,
            logo: this.brand.logo,
            cover: this.brand.cover,
            address: this.brand.address,
          },
        })
        .then(({ data }) => {
          console.log(data)
          this.brand = Object.assign({}, data.updateBrand)
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
}
</script>

<style></style>

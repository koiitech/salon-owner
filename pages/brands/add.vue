<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="6" lg="5" xl="4">
      <v-card>
        <v-form @submit.prevent="save">
          <v-img
            class="grey lighten-2 align-end"
            :aspect-ratio="16 / 9"
            :src="brand.cover | imgPath"
          >
            <v-row justify="center">
              <v-avatar size="150" class="mb-5" color="white">
                <v-btn
                  color="pink"
                  dark
                  small
                  absolute
                  bottom
                  fab
                  @click="$refs.logoInput.click()"
                >
                  <v-icon>mdi-camera</v-icon>
                </v-btn>
                <v-icon v-if="!brand.logo">mdi-image</v-icon>
                <img v-else :src="brand.logo | imgPath" alt="" />
              </v-avatar>
            </v-row>
            <v-btn
              color="pink"
              @click="$refs.coverInput.click()"
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
            <input
              type="file"
              ref="logoInput"
              accept="image/*"
              @change="logoPicked($event, 'logo')"
              class="d-none"
            />
            <input
              type="file"
              ref="coverInput"
              accept="image/*"
              @change="logoPicked($event, 'cover')"
              class="d-none"
            />
            <v-text-field
              class="d-none"
              label="Logo"
              type="text"
              v-model="brand.logo"
            >
            </v-text-field>
            <v-text-field
              class="d-none"
              label="Cover"
              type="text"
              v-model="brand.cover"
            >
            </v-text-field>
            <v-text-field label="Tên salon" type="text" v-model="brand.name">
            </v-text-field>
            <v-text-field label="Mô tả" type="text" v-model="brand.description">
            </v-text-field>
            <v-text-field label="Địa chỉ" type="text" v-model="brand.address">
            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :to="{ name: 'brands'}"
              >Huỷ</v-btn
            >
            <v-btn color="primary" :loading="$apollo.loading" type="submit"
              >Lưu</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
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
    uploadFileStatus: false,
  }),
  methods: {
    logoPicked(e, type) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.uploadFileStatus = true
        this.$apollo

          .mutate({
            mutation: gql`
              mutation UploadLogo($type: String!, $image: Upload!) {
                upload(image: $image, type: $type)
              }
            `,
            variables: {
              type: type,
              image: files[0],
            },
          })
          .then(({ data }) => {
            this.uploadFileStatus = false
            this.$set(this.brand, type, data.upload)
          })
          .catch((error) => {
            this.uploadFileStatus = false
            console.error(error)
          })
      }
    },
    save() {
      !this.brand.id ? this.saveNew() : this.saveUpdate()
    },
    saveNew() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation CreateBrand(
              $name: String!
              $description: String
              $logo: String
              $cover: String
              $address: String
            ) {
              createBrand(
                name: $name
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
            name: this.brand.name,
            description: this.brand.description,
            logo: this.brand.logo,
            cover: this.brand.cover,
            address: this.brand.address,
          },
        })
        .then(({ data }) => {
          console.log(data)
          this.brand = Object.assign({}, data.createBrand)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    saveUpdate() {
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

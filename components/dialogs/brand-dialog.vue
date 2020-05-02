<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Thương hiệu</span>
        <v-spacer />
        <v-btn @click="close" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-form @submit.prevent="save">
        <v-img
          class="grey lighten-2 align-end"
          :aspect-ratio="12 / 9"
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
          <v-btn @click="close">Huỷ</v-btn>
          <v-btn color="primary" :loading="$apollo.loading" type="submit"
            >Lưu</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data: () => ({
    promise: {},
    dialog: false,
    brand: {},
    uploadFileStatus: false,
  }),
  methods: {
    open(data = {}) {
      return new Promise((resolve, reject) => {
        this.promise = Object.assign({}, { resolve, reject })
        this.brand = Object.assign({}, data)
        this.dialog = true
      })
    },
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
          this.brand = Object.assign({}, data.createBrand)
          this.resolve()
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
          this.brand = Object.assign({}, data.updateBrand)
          this.resolve()
        })
        .catch((error) => {
          console.error(error)
        })
    },
    resolve(data) {
      this.promise.resolve(this.brand)
      this.close()
    },
    close() {
      this.dialog = false
    },
  },
}
</script>

<style></style>

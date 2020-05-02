<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-form @submit.prevent="save">
        <v-img
          class="grey lighten-2 align-end"
          :aspect-ratio="16 / 9"
          :src="salon.cover | imgPath"
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
              <v-icon v-if="!salon.logo">mdi-image</v-icon>
              <img v-else :src="salon.logo | imgPath" alt="" />
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
            v-model="salon.logo"
          >
          </v-text-field>
          <v-text-field
            class="d-none"
            label="Cover"
            type="text"
            v-model="salon.cover"
          >
          </v-text-field>
          <v-text-field label="Tên salon" type="text" v-model="salon.name">
          </v-text-field>
          <v-text-field label="Mô tả" type="text" v-model="salon.description">
          </v-text-field>
          <v-text-field label="Địa chỉ" type="text" v-model="salon.address">
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="close">Huỷ</v-btn>
          <v-btn color="primary" type="submit">Lưu</v-btn>
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
    salon: {},
    uploadFileStatus: false,
  }),
  methods: {
    open(data = {}) {
      return new Promise((resolve, reject) => {
        this.promise = Object.assign({}, { resolve, reject })
        this.salon = Object.assign({}, data)
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
            this.$set(this.salon, type, data.upload)
          })
          .catch((error) => {
            this.uploadFileStatus = false
            console.error(error)
          })
      }
    },
    save() {
      !this.salon.id ? this.saveNew() : this.saveUpdate()
    },
    saveNew() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation CreateSalon(
              $name: String!
              $description: String
              $logo: String
              $cover: String
              $address: String
              $brand_id: ID!
            ) {
              createSalon(
                name: $name
                description: $description
                logo: $logo
                cover: $cover
                address: $address
                brand_id: $brand_id
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
            name: this.salon.name,
            description: this.salon.description,
            logo: this.salon.logo,
            cover: this.salon.cover,
            address: this.salon.address,
            brand_id: this.$route.params.id,
          },
        })
        .then(({ data }) => {
          this.salon = Object.assign({}, data.createSalon)
          this.resolve(this.salon)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    saveUpdate() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation UpdateSalon(
              $id: ID!
              $name: String!
              $description: String
              $logo: String
              $cover: String
              $address: String
            ) {
              updateSalon(
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
            id: this.salon.id,
            name: this.salon.name,
            description: this.salon.description,
            logo: this.salon.logo,
            cover: this.salon.cover,
            address: this.salon.address,
          },
        })
        .then(({ data }) => {
          this.salon = Object.assign({}, data.updateSalon)
          this.resolve(this.salon)
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

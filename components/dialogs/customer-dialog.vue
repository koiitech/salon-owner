<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Nhân viên</span>
        <v-spacer />
        <v-btn @click="close" icon><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-form @submit.prevent="save">
        <v-card-text class="text-center">
          <v-avatar size="150" class="elevation-3" color="grey lighten-3">
            <v-btn
              color="pink"
              dark
              small
              absolute
              bottom
              fab
              @click="$refs.avatarInput.click()"
            >
              <v-icon>mdi-camera</v-icon>
            </v-btn>
            <v-icon v-if="!customer.avatar">mdi-image</v-icon>
            <img v-else :src="customer.avatar | imgPath" alt="" />
          </v-avatar>

          <input
            type="file"
            ref="avatarInput"
            accept="image/*"
            @change="imagePicked($event, 'avatar')"
            class="d-none"
          />

          <v-text-field
            class="d-none"
            label="Avatar"
            type="text"
            v-model="customer.avatar"
          />

          <v-text-field label="Tên" type="text" v-model="customer.name">
          </v-text-field>
          <v-text-field label="Email" type="email" v-model="customer.email">
          </v-text-field>
          <v-text-field
            v-if="!!!customer.id"
            label="Password"
            type="password"
            v-model="customer.password"
          >
          </v-text-field>
          <v-text-field label="Điện thoại" type="tel" v-model="customer.phone">
          </v-text-field>
          <v-text-field
            label="Sinh nhật (yyyy-mm-dd)"
            type="text"
            v-model="customer.birthday"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">Huỷ</v-btn>
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
    customer: {},
  }),

  methods: {
    open(data = {}) {
      return new Promise((resolve, reject) => {
        this.promise = Object.assign({}, { resolve, reject })
        this.customer = Object.assign({}, data)
        this.dialog = true
      })
    },
    imagePicked(e, type) {
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
            this.$set(this.customer, type, data.upload)
          })
          .catch((error) => {
            this.uploadFileStatus = false
            console.error(error)
          })
      }
    },
    save() {
      !this.customer.id ? this.saveNew() : this.saveUpdate()
    },
    saveNew() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation CreateCustomer(
              $name: String!
              $email: String
              $avatar: String
              $phone: String
              $birthday: Date
              $password: String!
              $brand_id: ID!
            ) {
              createCustomer(
                name: $name
                email: $email
                avatar: $avatar
                phone: $phone
                birthday: $birthday
                password: $password
                brand_id: $brand_id
              ) {
                id
                name
                email
                phone
                avatar
                birthday
                created_at
                updated_at
              }
            }
          `,
          variables: {
            name: this.customer.name,
            email: this.customer.email,
            avatar: this.customer.avatar,
            phone: this.customer.phone,
            birthday: this.customer.birthday,
            password: this.customer.password,
            brand_id: this.$route.params.id,
          },
        })
        .then(({ data }) => {
          this.customer = Object.assign({}, data.createCustomer)
          this.resolve(this.customer)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    saveUpdate() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation UpdateCustomer(
              $id: ID!
              $name: String!
              $email: String
              $avatar: String
              $phone: String
              $birthday: Date
            ) {
              updateCustomer(
                id: $id
                name: $name
                email: $email
                avatar: $avatar
                phone: $phone
                birthday: $birthday
              ) {
                id
                name
                email
                phone
                avatar
                birthday
                created_at
                updated_at
              }
            }
          `,
          variables: {
            id: this.customer.id,
            name: this.customer.name,
            email: this.customer.email,
            avatar: this.customer.avatar,
            phone: this.customer.phone,
            birthday: this.customer.birthday,
          },
        })
        .then(({ data }) => {
          this.customer = Object.assign({}, data.updateCustomer)
          this.resolve(this.customer)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    resolve(data) {
      this.promise.resolve(this.service)
      this.close()
    },
    close() {
      this.dialog = false
    },
  },
}
</script>

<style></style>

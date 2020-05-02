<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
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
            <v-icon v-if="!employee.avatar">mdi-image</v-icon>
            <img v-else :src="employee.avatar | imgPath" alt="" />
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
            v-model="employee.avatar"
          />

          <v-text-field label="Tên" type="text" v-model="employee.name">
          </v-text-field>
          <v-text-field label="Email" type="email" v-model="employee.email">
          </v-text-field>
          <v-text-field
            v-if="!!!employee.id"
            label="Password"
            type="password"
            v-model="employee.password"
          >
          </v-text-field>
          <v-text-field label="Điện thoại" type="tel" v-model="employee.phone">
          </v-text-field>
          <v-text-field
            label="Sinh nhật (yyyy-mm-dd)"
            type="text"
            v-model="employee.birthday"
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
    employee: {},
  }),

  methods: {
    open(data = {}) {
      return new Promise((resolve, reject) => {
        this.promise = Object.assign({}, { resolve, reject })
        this.employee = Object.assign({}, data)
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
            this.$set(this.employee, type, data.upload)
          })
          .catch((error) => {
            this.uploadFileStatus = false
            console.error(error)
          })
      }
    },
    save() {
      !this.employee.id ? this.saveNew() : this.saveUpdate()
    },
    saveNew() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation CreateEmployee(
              $name: String!
              $email: String
              $avatar: String
              $phone: String
              $birthday: Date
              $password: String!
              $brand_id: ID!
            ) {
              createEmployee(
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
            name: this.employee.name,
            email: this.employee.email,
            avatar: this.employee.avatar,
            phone: this.employee.phone,
            birthday: this.employee.birthday,
            password: this.employee.password,
            brand_id: this.$route.params.id,
          },
        })
        .then(({ data }) => {
          this.employee = Object.assign({}, data.createEmployee)
          this.resolve(this.employee)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    saveUpdate() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation UpdateEmployee(
              $id: ID!
              $name: String!
              $email: String
              $avatar: String
              $phone: String
              $birthday: Date
            ) {
              updateEmployee(
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
            id: this.employee.id,
            name: this.employee.name,
            email: this.employee.email,
            avatar: this.employee.avatar,
            phone: this.employee.phone,
            birthday: this.employee.birthday,
          },
        })
        .then(({ data }) => {
          this.employee = Object.assign({}, data.updateEmployee)
          this.resolve(this.employee)
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

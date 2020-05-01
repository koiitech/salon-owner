<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Dịch vụ con</span>
      </v-card-title>
      <v-card-text class="text-center">
        <v-avatar size="150" class="my-3" color="grey lighten-4 elevation-3">
          <v-btn
            color="pink"
            dark
            small
            absolute
            bottom
            fab
            @click="$refs.imageInput.click()"
          >
            <v-icon>mdi-camera</v-icon>
          </v-btn>
          <v-icon v-if="!extra.image">mdi-image</v-icon>
          <img v-else :src="extra.image | imgPath" alt="" />
        </v-avatar>
      </v-card-text>
      <v-card-text>
        <input
          type="file"
          ref="imageInput"
          accept="image/*"
          @change="imagePicked($event, 'extra')"
          class="d-none"
        />
        <v-text-field label="Tên*" v-model="extra.name" />
        <v-row>
          <v-col>
            <v-text-field type="number" label="Giá*" v-model="extra.price" />
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              label="Thời gian làm*"
              v-model="extra.minutes"
            />
          </v-col>
        </v-row>
        <v-textarea label="Mô tả" v-model="extra.description" />
        <small>* là những giá trị bắt buộc phải điền</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">Close</v-btn>
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data() {
    return {
      promise: {},
      dialog: false,
      extra: {},
    }
  },
  methods: {
    open(data = {}) {
      return new Promise((resolve, reject) => {
        this.promise = Object.assign({}, { resolve, reject })
        this.extra = Object.assign({}, data)
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
              mutation Upload($type: String!, $image: Upload!) {
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
            this.$set(this.extra, 'image', data.upload)
          })
          .catch((error) => {
            this.uploadFileStatus = false
            console.error(error)
          })
      }
    },
    save() {
      !this.extra.id ? this.saveNew() : this.saveUpdate()
    },
    saveNew() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation CreateExtra(
              $name: String!
              $description: String
              $image: String
              $price: Float
              $minutes: Int
              $index: Int
              $service_id: ID!
            ) {
              createExtra(
                name: $name
                description: $description
                image: $image
                price: $price
                minutes: $minutes
                index: $index
                service_id: $service_id
              ) {
                id
                name
                price
                index
                image
                minutes
                description
              }
            }
          `,
          variables: {
            name: this.extra.name,
            description: this.extra.description,
            image: this.extra.image,
            index: this.extra.index,
            price: this.extra.price,
            minutes: this.extra.minutes,
            service_id: this.extra.service_id,
          },
        })
        .then(({ data }) => {
          this.extra = Object.assign({}, data.createExtra)
          this.resolve(this.extra)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    saveUpdate() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation UpdateExtra(
              $id: ID!
              $name: String!
              $description: String
              $image: String
              $price: Float
              $minutes: Int
              $index: Int
            ) {
              updateExtra(
                id: $id
                name: $name
                description: $description
                image: $image
                price: $price
                minutes: $minutes
                index: $index
              ) {
                id
                name
                price
                index
                image
                minutes
                description
              }
            }
          `,
          variables: {
            id: this.extra.id,
            name: this.extra.name,
            description: this.extra.description,
            image: this.extra.image,
            index: this.extra.index,
            price: this.extra.price,
            minutes: this.extra.minutes,
          },
        })
        .then(({ data }) => {
          this.extra = Object.assign({}, data.updateExtra)
          this.resolve(this.extra)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    resolve(data) {
      this.promise.resolve(this.extra)
      this.close()
    },
    close() {
      this.dialog = false
    },
  },
}
</script>

<style></style>

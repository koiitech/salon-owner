<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Dịch vụ</span>
        <v-spacer />
        <v-btn @click="close" icon><v-icon>mdi-close</v-icon></v-btn>
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
          <v-icon v-if="!service.image">mdi-image</v-icon>
          <img v-else :src="service.image | imgPath" alt="" />
        </v-avatar>
      </v-card-text>
      <v-card-text>
        <input
          type="file"
          ref="imageInput"
          accept="image/*"
          @change="imagePicked($event, 'service')"
          class="d-none"
        />
        <v-row>
          <v-col v-if="!service.id">
            <v-autocomplete
              v-model="service.category_id"
              :items="categories"
              hide-no-data
              hide-selected
              item-text="name"
              item-value="id"
              label="Danh mục"
              placeholder="Chọn danh mục"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-text-field label="Tên*" v-model="service.name" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field type="number" label="Giá*" v-model="service.price" />
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              label="Thời gian làm*"
              v-model="service.minutes"
            />
          </v-col>
        </v-row>
        <v-textarea label="Mô tả" rows="2" v-model="service.description" />
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
      service: {},
    }
  },
  props: {
    categories: Array,
  },
  methods: {
    open(data = {}) {
      return new Promise((resolve, reject) => {
        this.promise = Object.assign({}, { resolve, reject })
        this.service = Object.assign({}, data)
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
            this.$set(this.service, 'image', data.upload)
          })
          .catch((error) => {
            this.uploadFileStatus = false
            console.error(error)
          })
      }
    },
    save() {
      !this.service.id ? this.saveNew() : this.saveUpdate()
    },
    saveNew() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation CreateService(
              $name: String!
              $description: String
              $image: String
              $price: Float
              $minutes: Int
              $index: Int
              $category_id: ID!
            ) {
              createService(
                name: $name
                description: $description
                image: $image
                price: $price
                minutes: $minutes
                index: $index
                category_id: $category_id
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
            name: this.service.name,
            description: this.service.description,
            image: this.service.image,
            index: this.service.index,
            price: this.service.price,
            minutes: this.service.minutes,
            category_id: this.service.category_id,
          },
        })
        .then(({ data }) => {
          this.service = Object.assign({}, data.createService)
          this.resolve(this.service)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    saveUpdate() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation UpdateService(
              $id: ID!
              $name: String!
              $description: String
              $image: String
              $price: Float
              $minutes: Int
              $index: Int
            ) {
              updateService(
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
            id: this.service.id,
            name: this.service.name,
            description: this.service.description,
            image: this.service.image,
            index: this.service.index,
            price: this.service.price,
            minutes: this.service.minutes,
          },
        })
        .then(({ data }) => {
          this.service = Object.assign({}, data.updateService)
          this.resolve(this.service)
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

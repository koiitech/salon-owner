<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Danh mục</span>
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
          <v-icon v-if="!category.image">mdi-image</v-icon>
          <img v-else :src="category.image | imgPath" alt="" />
        </v-avatar>
      </v-card-text>
      <v-card-text>
        <input
          type="file"
          ref="imageInput"
          accept="image/*"
          @change="imagePicked($event, 'category')"
          class="d-none"
        />
        <v-text-field label="Tên*" v-model="category.name" />
        <v-textarea label="Mô tả" rows="2" v-model="category.description" />
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
      category: {},
    }
  },
  methods: {
    open(data = {}) {
      return new Promise((resolve, reject) => {
        this.promise = Object.assign({}, { resolve, reject })
        this.category = Object.assign({}, data)
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
            this.$set(this.category, 'image', data.upload)
          })
          .catch((error) => {
            this.uploadFileStatus = false
            console.error(error)
          })
      }
    },
    save() {
      !this.category.id ? this.saveNew() : this.saveUpdate()
    },
    saveNew() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation CreateCategory(
              $name: String!
              $description: String
              $image: String
              $index: Int
              $salon_id: ID!
            ) {
              createCategory(
                name: $name
                description: $description
                image: $image
                index: $index
                salon_id: $salon_id
              ) {
                id
                name
                description
                image
                index
              }
            }
          `,
          variables: {
            name: this.category.name,
            description: this.category.description,
            image: this.category.image,
            index: this.category.index,
            salon_id: this.category.salon_id,
          },
        })
        .then(({ data }) => {
          this.category = Object.assign({}, data.createCategory)
          this.resolve(this.category)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    saveUpdate() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation UpdateCategory(
              $id: ID!
              $name: String!
              $description: String
              $image: String
              $index: Int
            ) {
              updateCategory(
                id: $id
                name: $name
                description: $description
                image: $image
                index: $index
              ) {
                id
                name
                description
                image
                index
              }
            }
          `,
          variables: {
            id: this.category.id,
            name: this.category.name,
            description: this.category.description,
            image: this.category.image,
            index: this.category.index,
          },
        })
        .then(({ data }) => {
          this.category = Object.assign({}, data.updateCategory)
          this.resolve(this.category)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    resolve(data) {
      this.promise.resolve(this.category)
      this.close()
    },
    close() {
      this.dialog = false
    },
  },
}
</script>

<style></style>

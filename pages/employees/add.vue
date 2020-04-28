<template>
  <v-row justify="center">
    <v-col cols="12" sm="6" md="5" lg="4">
      <v-card>
        <v-form @submit.prevent="save">
          <v-card-text class="text-center">
            <v-avatar size="150" class="mb-5" color="white">
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

            <v-text-field label="Tên salon" type="text" v-model="employee.name">
            </v-text-field>
            <v-text-field
              label="Mô tả"
              type="text"
              v-model="employee.description"
            >
            </v-text-field>
            <v-text-field
              label="Địa chỉ"
              type="text"
              v-model="employee.address"
            >
            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :to="{ name: 'brands' }">Huỷ</v-btn>
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
    employee: {
      query: gql`
        query GetEmployee($id: ID!) {
          employee(id: $id) {
            id
            name
            email
            phone
            avatar
            birthday
            created_at
            updated_at
            brand {
              id
              name
              logo
            }
            salon {
              id
              name
              logo
              address
            }
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
    employee: {},
  }),
  methods: {
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
            this.$set(this.brand, type, data.upload)
          })
          .catch((error) => {
            this.uploadFileStatus = false
            console.error(error)
          })
      }
    },
  },
}
</script>

<style></style>

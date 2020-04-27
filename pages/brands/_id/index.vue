<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card :to="{ name: 'brands-id-edit', params: { id: brand.id } }">
          <v-card-title>{{ brand.name }}</v-card-title>
          <v-card-text>{{ brand.description }}</v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>Salons</v-card-title>
          <v-card-text>
            <v-card v-for="(salon, index) in brand.salons" :key="index">
              <v-img
                class="align-end justify-center"
                :aspect-ratio="16 / 9"
                :src="salon.cover | imgPath"
              >
                <v-row align="center" justify="center">
                  <v-avatar size="150" class="mb-5">
                    <img :src="salon.logo | imgPath" alt="" />
                  </v-avatar>
                </v-row>
              </v-img>
              <v-card-title>{{ salon.name }}</v-card-title>
              <v-card-text>{{ brand.description }}</v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
            address
            cover
            logo
            salons {
              id
              name
            }
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id, // Works here!
        }
      },
    },
  },
  data: () => ({
    brand: {},
  }),
  methods: {},
}
</script>

<style></style>

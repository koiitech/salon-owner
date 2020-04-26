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
        <v-card v-for="(salon, index) in brand.salons" :key="index">
          <v-card-title>{{ salon.name }}</v-card-title>
          <v-card-text>{{ brand.description }}</v-card-text>
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
            convert
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
  methods: {
    editBrand() {
      this.$router.push({
        name: 'brands-id-edit',
        params: { id: this.brand.id },
      })
    },
  },
}
</script>

<style></style>

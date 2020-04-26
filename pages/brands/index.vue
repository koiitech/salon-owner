<template>
  <v-card>
    <v-toolbar>
      <v-btn :to="{name: 'brands-add'}">Thêm mới</v-btn>
    </v-toolbar>
    <v-data-table
      :headers="[
        {
          text: 'Tên',
          value: 'name',
        },
        { text: 'Logo', value: 'logo' },
        { text: 'Mô tả', value: 'description' },
        { text: '', value: '' },
      ]"
      :items="brands.data"
      :options.sync="options"
      :server-items-length="brands.paginatorInfo.total"
      :loading="$apollo.loading"
      @click:row="openBrand"
    ></v-data-table>
  </v-card>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    brands: {
      query: gql`
        query GetBrands($page: Int, $first: Int!) {
          brands(page: $page, first: $first) {
            data {
              id
              name
              logo
              description
            }
            paginatorInfo {
              hasMorePages
            }
          }
        }
      `,
      variables: {
        page: 1,
        first: 10,
      },
    },
  },
  data: () => ({
    brands: {
      data: [],
      paginatorInfo: {},
    },
    options: {},
  }),
  methods: {
    openBrand(item) {
      this.$router.push({ name: 'brands-id', params: { id: item.id } })
    },
  },
}
</script>

<style></style>

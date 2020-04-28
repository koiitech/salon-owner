<template>
  <v-card>
    <v-toolbar>
      <v-btn :to="{ name: 'employees-add' }">Thêm mới</v-btn>
    </v-toolbar>
    <v-data-table
      :headers="[
        { text: 'Tên', value: 'name' },
        { text: 'email', value: 'email' },
        { text: '', value: '' },
      ]"
      :items="employees.data"
      :options.sync="options"
      :server-items-length="employees.paginatorInfo.total"
      :loading="$apollo.loading"
      @click:row="
        (item) =>
          $router.push({ name: 'employees-id', params: { id: item.id } })
      "
    ></v-data-table>
  </v-card>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    employees: {
      query: gql`
        query GetEmployees($first: Int!, $page: Int) {
          employees(first: $first, page: $page) {
            data {
              id
              name
              email
            }
            paginatorInfo {
              total
              hasMorePages
            }
          }
        }
      `,
      variables() {
        return {
          page: this.options.page || 1,
          first: this.options.itemsPerPage || 10,
        }
      },
    },
  },
  data: () => ({
    employees: {
      data: [],
      paginatorInfo: {},
    },
    options: {},
  }),
}
</script>

<style></style>

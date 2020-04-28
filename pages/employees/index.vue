<template>
  <v-card>
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
          $router.push({
            name: 'brands-id-employees-employee',
            params: { id: item.brand_id, employee: item.id },
          })
      "
    >
      <template v-slot:top>
        <v-toolbar color="primary" dark flat>
          <v-icon left>mdi-account-box-multiple</v-icon> Nhân viên
          <v-spacer />
          <v-text-field
            solo-inverted
            label="Tìm nhân viên"
            hide-details
            single-line
            clearable
            rounded
          ></v-text-field>
        </v-toolbar> </template
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
              brand_id
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

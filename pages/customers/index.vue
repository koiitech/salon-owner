<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-icon left>mdi-account-group-outline</v-icon>Khách hàng
      <v-spacer />
      <v-toolbar-items>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text @click="openCustomerDialog"
              ><v-icon>mdi-account-plus-outline</v-icon></v-btn
            >
          </template>
          <span>Thêm khách hàng</span>
        </v-tooltip>
      </v-toolbar-items>
    </v-toolbar>
    <v-data-table
      :headers="[
        { text: '', value: 'avatar', sortable: false, width: '1%' },
        { text: 'Tên', value: 'name' },
        { text: 'Mô tả', value: 'email', sortable: false },
        { text: '', value: '' },
      ]"
      :items="customers.data"
      :options.sync="options"
      :server-items-length="customers.paginatorInfo.total"
      :loading="$apollo.loading"
      @click:row="
        (item) =>
          $router.push({ name: 'customers-id', params: { id: item.id } })
      "
    >
      <template v-slot:item.avatar="{ item }">
        <v-avatar size="32" class="elevation-1">
          <v-icon v-if="!item.avatar">
            mdi-account-outline
          </v-icon>
          <img v-else :src="item.avatar | imgPath" alt="item.name" />
        </v-avatar>
      </template>
    </v-data-table>
    <customer-dialog ref="customerDialog" />
  </v-card>
</template>

<script>
import gql from 'graphql-tag'
import CustomerDialog from '~/components/dialogs/customer-dialog.vue'
export default {
  components: { CustomerDialog },
  apollo: {
    customers: {
      query: gql`
        query GetCustomers($page: Int, $first: Int!) {
          customers(page: $page, first: $first) {
            data {
              id
              name
              avatar
              email
            }
            paginatorInfo {
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
    customers: {
      data: [],
      paginatorInfo: {},
    },
    options: {},
  }),
  methods: {
    openCustomerDialog() {
      this.$refs.customerDialog.open().then((result) => {
        this.$apollo.queries.customers.refetch()
      })
    },
  },
}
</script>

<style></style>

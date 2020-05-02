<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-text class="blue white--text text-center">
          <v-avatar size="150" color="blue lighten-3">
            <v-icon x-large dark v-if="!customer.avatar">mdi-account-outline</v-icon>
            <img v-else :src="customer.avatar | imgPath" alt="" />
          </v-avatar>
          <v-card-title class="justify-center">{{
            customer.name
          }}</v-card-title>
        </v-card-text>
        <v-divider />
        <v-list>
          <v-list-item>
            <v-list-item-action>
              <v-icon>mdi-email-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ customer.email }}</v-list-item-title>
              <v-list-item-subtitle>Email</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset />
          <v-list-item>
            <v-list-item-action>
              <v-icon>mdi-phone-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ customer.phone }}</v-list-item-title>
              <v-list-item-subtitle>Phone</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset />
          <v-list-item>
            <v-list-item-action>
              <v-icon>mdi-cake</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ customer.birthday }}</v-list-item-title>
              <v-list-item-subtitle>Birthday</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="openCustomerDialog(customer)" text color="primary"
            >Sửa</v-btn
          >
        </v-card-actions>
      </v-card>

      <customer-dialog ref="customerDialog" />
    </v-col>
  </v-row>
</template>

<script>
import gql from 'graphql-tag'
import CustomerDialog from '~/components/dialogs/customer-dialog.vue'
export default {
  components: { CustomerDialog },
  apollo: {
    customer: {
      query: gql`
        query GetCustomer($id: ID!) {
          customer(id: $id) {
            id
            name
            email
            avatar
            phone
            birthday
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
    },
  },
  data: () => ({
    customer: {},
    salons: [],
  }),
  methods: {
    openCustomerDialog(data) {
      this.$refs.customerDialog.open(data).then((result) => {
        this.$apollo.queries.customer.refetch()
      })
    },
  },
}
</script>

<style></style>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-text class="text-center">
          <v-avatar class="mx-auto" Í size="150" color="grey">
            <v-icon>mdi-account</v-icon>
          </v-avatar>
          <v-card-title class="justify-center">{{
            employee.name
          }}</v-card-title>
          <v-card-subtitle>{{ employee.email }}</v-card-subtitle>
        </v-card-text>
        <v-divider />
        <v-list>
          <template v-if="employee.brand">
            <v-list-item
              :to="{ name: 'brands-id', params: { id: employee.brand.id } }"
            >
              <v-list-item-avatar>
                <v-img
                  :src="employee.brand.logo | imgPath"
                  :alt="employee.brand.name"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ employee.brand.name }}</v-list-item-title>
                <v-list-item-subtitle>Thương hiệu</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template v-if="employee.salon">
            <v-list-item>
              <v-list-item-avatar>
                <v-img :src="employee.salon.logo" alt=""></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ employee.salon.name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  employee.salon.address
                }}</v-list-item-subtitle>
                <v-list-item-subtitle>Nơi làm việc</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :to="{ name: 'employees-id-edit', params: { id: employee.id } }"
            text
            color="primary"
            >Sửa</v-btn
          >
        </v-card-actions>
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
    },
  },
  data: () => ({
    employee: {},
  }),
}
</script>

<style></style>

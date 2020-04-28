<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card :to="{ name: 'brands-id-edit', params: { id: brand.id } }">
          <v-img
            class="grey lighten-2 align-end elevation-3"
            :aspect-ratio="16 / 9"
            :src="brand.cover | imgPath"
          >
            <v-row justify="center">
              <v-avatar size="150" class="mb-5 elevation-3" color="white">
                <v-icon v-if="!brand.logo">mdi-image</v-icon>
                <img v-else :src="brand.logo | imgPath" alt="" />
              </v-avatar>
            </v-row>
          </v-img>
          <v-card-title>{{ brand.name }}</v-card-title>
          <v-card-subtitle>{{ brand.address }}</v-card-subtitle>
          <v-card-text>
            <v-row align="center" class="mx-0">
              <v-rating
                :value="4.5"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
              ></v-rating>

              <div class="grey--text ml-4">4.5 (413)</div>
            </v-row>

            <div class="my-4">
              {{ brand.description }}
            </div>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="deep-purple lighten-2" text>
              Sửa
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined>
          <v-toolbar color="primary" dark>
            <v-btn
              :to="{ name: 'brands-id-salons-add', params: { id: brand.id } }"
              ><v-icon left>mdi-plus</v-icon> Thêm mới</v-btn
            >
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn text @click="$apollo.queries.brand.refetch()"
                ><v-icon>mdi-sync</v-icon></v-btn
              >
            </v-toolbar-items>
          </v-toolbar>

          <v-list three-line>
            <v-subheader>Salons</v-subheader>
            <template v-for="(item, index) in brand.salons">
              <v-list-item
                :key="index"
                :to="{
                  name: 'brands-id-salons-salon-edit',
                  params: { id: brand.id, salon: item.id },
                }"
              >
                <v-list-item-avatar>
                  <v-img sizes="92" :src="item.logo | imgPath"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="item.address"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12">
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
              <v-divider vertical class="mx-3" />
              <v-btn
                :to="{
                  name: 'brands-id-employees-add',
                  params: { id: brand.id },
                }"
                ><v-icon left>mdi-plus</v-icon>Thêm mới</v-btn
              >
            </v-toolbar>
          </template></v-data-table
        >
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
            description
            salons {
              id
              name
              address
              cover
              logo
              description
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

    employees: {
      query: gql`
        query GetEmployees($first: Int!, $page: Int, $brand_id: ID) {
          employees(first: $first, page: $page, brand_id: $brand_id) {
            data {
              id
              name
              email
              avatar
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
          brand_id: this.$route.params.id,
        }
      },
    },
  },
  data: () => ({
    brand: {},
    options: {},
    employees: {
      data: [],
      paginatorInfo: {},
    },
  }),
  methods: {},
}
</script>

<style></style>

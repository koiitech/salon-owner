<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="5" lg="4">
        <v-card>
          <v-img
            class="grey lighten-2 align-end"
            :aspect-ratio="16 / 9"
            :src="salon.cover | imgPath"
          >
            <v-row justify="center">
              <v-avatar size="150" class="mb-5 elevation-3" color="white">
                <v-icon v-if="!salon.logo">mdi-image</v-icon>
                <img v-else :src="salon.logo | imgPath" alt="" />
              </v-avatar>
            </v-row>
          </v-img>
          <v-card-title>{{ salon.name }}</v-card-title>
          <v-card-subtitle>{{ salon.address }}</v-card-subtitle>
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
              {{ salon.description }}
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
      <v-col cols="12" sm="6" md="7" lg="8">
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
              <v-toolbar-items>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn text v-on="on"
                      ><v-icon>mdi-account-plus-outline</v-icon></v-btn
                    >
                  </template>
                  <span>Thêm nhân viên</span>
                </v-tooltip>
              </v-toolbar-items>
            </v-toolbar>
          </template></v-data-table
        >
      </v-col>
      <v-col>
        <v-toolbar dark color="primary"
          ><v-toolbar-title>Thực đơn</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on"><v-icon>mdi-server-plus</v-icon></v-btn>
              </template>
              <span>Thêm danh mục</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on"
                  ><v-icon>mdi-text-box-plus-outline</v-icon></v-btn
                >
              </template>
              <span>Thêm dịch vụ</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on"><v-icon>mdi-tray-plus</v-icon></v-btn>
              </template>
              <span>Thêm dịch vụ con</span>
            </v-tooltip>
          </v-toolbar-items>
        </v-toolbar>
        <v-expansion-panels focusable>
          <v-expansion-panel v-for="category in categories" :key="category.id">
            <v-expansion-panel-header>
              <v-list three-line>
                <v-list-item>
                  <v-list-item-action v-if="!category.image">
                    <v-icon>mdi-camera</v-icon>
                  </v-list-item-action>
                  <v-list-item-avatar v-else>
                    <img :src="category.image" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ category.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      category.description
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list three-line>
                <template v-for="service in category.services">
                  <v-list-group :key="service.id" no-action value="true">
                    <template v-slot:activator>
                      <v-list-item-action v-if="!service.image">
                        <v-icon>mdi-camera</v-icon>
                      </v-list-item-action>
                      <v-list-item-avatar v-else>
                        <img :src="service.image" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          service.name
                        }}</v-list-item-title>
                        <v-list-item-subtitle
                          >${{ service.description }}</v-list-item-subtitle
                        >
                      </v-list-item-content>
                      <v-list-item-action>
                        ${{ service.price }}
                      </v-list-item-action>
                    </template>

                    <v-list-item
                      class="ml-5"
                      v-for="extra in service.extras"
                      :key="extra.id"
                    >
                      <v-list-item-action v-if="!extra.image">
                        <v-icon>mdi-camera</v-icon>
                      </v-list-item-action>
                      <v-list-item-avatar v-else>
                        <img :src="extra.image" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ extra.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          extra.description
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        ${{ extra.price }}
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-group>
                </template>
              </v-list>
              <!-- <v-list three-line>
                    <v-list-item
                      v-for="service in category.services"
                      :key="service.id"
                    >
                      <v-list-item-avatar>
                        <img :src="service.image" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          service.name
                        }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          service.description
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        ${{ service.price }}
                      </v-list-item-action>
                    </v-list-item>
                    <v-list class="ml-5" three-line>
                      <v-list-item
                        v-for="extra in service.extras"
                        :key="extra.id"
                      >
                        <v-list-item-avatar>
                          <img :src="extra.image" />
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{
                            extra.name
                          }}</v-list-item-title>
                          <v-list-item-subtitle>{{
                            extra.description
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          ${{ extra.price }}
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-list> -->
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    salon: {
      query: gql`
        query GetSalon($id: ID!) {
          salon(id: $id) {
            id
            name
            address
            cover
            logo
            description
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.salon,
        }
      },
    },

    employees: {
      query: gql`
        query GetEmployees($first: Int!, $page: Int, $salon_id: ID) {
          employees(first: $first, page: $page, salon_id: $salon_id) {
            data {
              id
              name
              email
              avatar
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
          salon_id: this.$route.params.salon,
        }
      },
    },
    categories: {
      query: gql`
        query GetCategories($salon_id: ID) {
          categories(salon_id: $salon_id) {
            id
            name
            image
            description
            services {
              id
              name
              description
              image
              price
              extras {
                id
                name
                description
                image
                price
              }
            }
          }
        }
      `,
      variables() {
        return {
          salon_id: this.$route.params.salon,
        }
      },
    },
  },
  data: () => ({
    salon: {},
    options: {},
    employees: {
      data: [],
      paginatorInfo: {},
    },
    categories: [],
  }),
  methods: {},
}
</script>

<style></style>

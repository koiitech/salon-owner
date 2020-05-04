<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="5" lg="4">
        <v-card>
          <v-img
            class="grey lighten-2 align-end elevation-3"
            :aspect-ratio="12 / 9"
            :src="brand.cover | imgPath"
          >
            <v-row justify="center">
              <v-avatar size="120" class="mb-2 elevation-3" color="white">
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
            <v-btn color="primary" @click="openBrandDialog(brand)" text>
              Sửa
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="7" lg="8">
        <v-card outlined>
          <v-toolbar color="primary" dark>
            <v-icon left>mdi-home-outline</v-icon>Salons

            <v-spacer />
            <v-toolbar-items>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    v-on="on"
                    @click="openSalonDialog({ brand_id: brand.id })"
                    ><v-icon>mdi-home-plus-outline</v-icon></v-btn
                  >
                </template>
                <span>Thêm salon</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" text @click="$apollo.queries.brand.refetch()"
                    ><v-icon>mdi-sync</v-icon></v-btn
                  >
                </template>
                <span>Tải lại salons</span>
              </v-tooltip>
            </v-toolbar-items>
          </v-toolbar>

          <v-list three-line>
            <template v-for="(item, index) in brand.salons">
              <v-list-item
                :key="index"
                :to="{
                  name: 'salons-salon',
                  params: { salon: item.id },
                }"
              >
                <v-list-item-avatar>
                  <v-icon v-if="!item.logo">mdi-camera</v-icon>
                  <v-img v-else :src="item.logo | imgPath"></v-img>
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
        <v-card>
          <v-toolbar color="primary" dark flat>
            <v-icon left>mdi-account-box-multiple</v-icon> Nhân viên
            <v-spacer />
            <v-toolbar-items>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    icon
                    @click="openEmployeeDialog({ brand_id: brand.id })"
                    ><v-icon>mdi-account-plus-outline</v-icon></v-btn
                  >
                </template>
                <span>Thêm nhân viên</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    icon
                    @click="$apollo.queries.employees.refetch()"
                    ><v-icon>mdi-sync</v-icon></v-btn
                  >
                </template>
                <span>Cập nhật dữ liệu</span>
              </v-tooltip>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text class="py-0">
            <v-row>
              <v-col cols="12" sm="6"></v-col>
              <v-col cols="12" sm="6"
                ><v-text-field
                  v-model="keyword"
                  append-icon="mdi-magnify"
                  label="Tìm nhân viên"
                  single-line
                  hide-details
                ></v-text-field
              ></v-col>
            </v-row>
          </v-card-text>
          <v-data-table
            :headers="[
              { text: '', value: 'avatar', width: '1%', sortable: false },
              { text: 'Tên', value: 'name' },
              { text: 'email', value: 'email' },
              { text: '', value: 'actions' },
            ]"
            :items="employees.data"
            :options.sync="options"
            :server-items-length="employees.paginatorInfo.total"
            :loading="$apollo.loading"
            @click:row="
              (item) =>
                $router.push({
                  name: 'brands-id-employees-employee',
                  params: { employee: item.id },
                })
            "
          >
            <template v-slot:item.avatar="{ item }">
              <v-avatar size="32" class="elevation-1">
                <v-icon v-if="!item.avatar">mdi-account</v-icon>
                <img v-else :src="item.avatar | imgPath" :alt="item.id" />
              </v-avatar>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <brand-dialog ref="brandDialog" />
    <salon-dialog ref="salonDialog" />
    <employee-dialog ref="employeeDialog" />
  </v-container>
</template>

<script>
import getBrand from '~/graphql/queries/getBrand.gql'
import getEmployees from '~/graphql/queries/getEmployees.gql'

import BrandDialog from '~/components/dialogs/brand-dialog.vue'
import SalonDialog from '~/components/dialogs/salon-dialog.vue'
import EmployeeDialog from '~/components/dialogs/employee-dialog.vue'

export default {
  components: { BrandDialog, SalonDialog, EmployeeDialog },
  apollo: {
    brand: {
      query: getBrand,
      variables() {
        return {
          id: this.$route.params.id, // Works here!
        }
      },
    },

    employees: {
      query: getEmployees,
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
    keyword: '',
    employees: {
      data: [],
      paginatorInfo: {},
    },
  }),
  methods: {
    openBrandDialog(data) {
      this.$refs.brandDialog.open(data).then((result) => {
        this.$apollo.queries.brand.refetch()
      })
    },
    openSalonDialog(data) {
      this.$refs.salonDialog.open(data).then((result) => {
        this.$apollo.queries.brand.refetch()
      })
    },
    openEmployeeDialog(data) {
      this.$refs.employeeDialog.open(data).then((result) => {
        this.$apollo.queries.employees.refetch()
      })
    },
  },
}
</script>

<style></style>

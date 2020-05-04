<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-icon left>mdi-star-circle-outline</v-icon>Thương hiệu
      <v-spacer />
      <v-toolbar-items>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text @click="openBrandDialog"
              ><v-icon>mdi-plus-circle-outline</v-icon></v-btn
            >
          </template>
          <span>Thêm thương hiệu</span>
        </v-tooltip>
      </v-toolbar-items>
    </v-toolbar>
    <v-data-table
      :headers="[
        { text: '', value: 'logo', sortable: false, width: '1%' },
        { text: 'Tên', value: 'name' },
        { text: 'Mô tả', value: 'description', sortable: false },
        { text: '', value: '' },
      ]"
      :items="brands.data"
      :options.sync="options"
      :server-items-length="brands.paginatorInfo.total"
      :loading="$apollo.loading"
      @click:row="
        (item) => $router.push({ name: 'brands-id', params: { id: item.id } })
      "
    >
      <template v-slot:item.logo="{ item }">
        <v-avatar size="32" class="elevation-1">
          <v-icon v-if="!item.logo">
            mdi-camera
          </v-icon>
          <img v-else :src="item.logo | imgPath" alt="item.name" />
        </v-avatar>
      </template>
    </v-data-table>
    <brand-dialog ref="brandDialog" />
  </v-card>
</template>

<script>
import getBrands from "~/graphql/queries/getBrands.gql";
import BrandDialog from '~/components/dialogs/brand-dialog.vue'
export default {
  components: { BrandDialog },
  apollo: {
    brands: {
      query: getBrands,
      variables() {
        return {
          page: this.options.page || 1,
          first: this.options.itemsPerPage || 10,
        }
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
    openBrandDialog() {
      this.$refs.brandDialog.open().then((result) => {
        this.$apollo.queries.brands.refetch()
      })
    },
  },
}
</script>

<style></style>

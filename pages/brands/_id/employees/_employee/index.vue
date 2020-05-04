<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-text class="text-center">
          <v-avatar size="150" color="grey">
            <v-icon v-if="!employee.avatar">mdi-account</v-icon>
            <img v-else :src="employee.avatar | imgPath" alt="" />
          </v-avatar>
          <v-card-title class="justify-center">{{
            employee.name
          }}</v-card-title>
          <v-card-subtitle>{{ employee.email }}</v-card-subtitle>
        </v-card-text>
        <v-divider />
        <v-list>
          <v-list-item three-line>
            <v-list-item-avatar>
              <v-icon>mdi-map-marker</v-icon>
            </v-list-item-avatar>

            <v-list-item-content v-if="!employee.salon">
              <v-list-item-title>Chưa xác định chỗ làm</v-list-item-title>
              <v-list-item-subtitle>Vị trí làm việc</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content v-else>
              <v-list-item-title>{{ employee.salon.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                employee.salon.address
              }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-edit-dialog large persistent @save="saveUpdateEmployeeSalon">
                <v-btn icon>
                  <v-icon>mdi-circle-edit-outline</v-icon>
                </v-btn>
                <template v-slot:input>
                  <v-autocomplete
                    v-model="employee.salon_id"
                    :items="salons"
                    hide-no-data
                    hide-selected
                    item-text="name"
                    item-value="id"
                    label="Salons"
                    placeholder="Chọn salons"
                  ></v-autocomplete>
                </template>
              </v-edit-dialog>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="openEmployeeDialog(employee)" text color="primary"
            >Sửa</v-btn
          >
        </v-card-actions>
      </v-card>

      <employee-dialog ref="employeeDialog" />
    </v-col>
  </v-row>
</template>

<script>
import getEmployee from '~/graphql/queries/getEmployee.gql'
import getSalons from '~/graphql/queries/getSalons.gql'
import updateEmployeeSalon from '~/graphql/mutations/updateEmployeeSalon.gql'

import EmployeeDialog from '~/components/dialogs/employee-dialog.vue'
export default {
  components: { EmployeeDialog },
  apollo: {
    employee: {
      query: getEmployee,
      variables() {
        return {
          id: this.$route.params.employee,
        }
      },
    },
    salons: {
      query: getSalons,
      variables() {
        return {
          brand_id: this.$route.params.id,
        }
      },
    },
  },
  data: () => ({
    employee: {},
    salons: [],
  }),
  methods: {
    openEmployeeDialog(data) {
      this.$refs.employeeDialog.open(data).then((result) => {
        this.$apollo.queries.employee.refetch()
      })
    },
    saveUpdateEmployeeSalon(item) {
      this.$apollo
        .mutate({
          mutation: updateEmployeeSalon,
          variables: {
            id: this.employee.id,
            salon_id: this.employee.salon_id,
          },
        })
        .then(({ data }) => {
          this.$apollo.queries.employee.refetch()
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
}
</script>

<style></style>

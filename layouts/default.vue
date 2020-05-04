<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" clipped app>
      <v-list two-line>
        <v-list-item
          active-class="primary white--text"
          v-for="(item, i) in items"
          :key="i"
          :to="{ name: item.name }"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app color="white">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-toolbar-items>
        <v-menu bottom left offset-y>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>Thông tin</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>Đăng xuất</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-content class="grey lighten-4">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      drawer: true,
      items: [
        {
          icon: 'mdi-star-box-multiple-outline',
          title: 'Thương hiệu',
          name: 'brands',
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Khách hàng',
          name: 'customers',
        },
      ],
      title: 'Hệ thống quản lý salon',
    }
  },
  computed: mapState({
    // arrow functions can make the code very succinct!
    user: (state) => state.auth.user,

    // passing the string value 'count' is same as `state => state.count`
  }),
  methods: {
    logout() {
      this.$auth.logout().then(() => {
        this.$router.replace({ name: 'login' })
      })
    },
  },
}
</script>

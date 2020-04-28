<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
    >
      <v-list two-line>
        <v-list-item active-class="primary white--text"
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
     
    </v-app-bar>
    <v-content class="grey lighten-4">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  
  
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        {
          icon: 'mdi-chart-bubble',
          title: 'Salon',
          name: 'brands',
        },
        {
          icon: 'mdi-users',
          title: 'Nhân viên',
          name: 'employees',
        },
      ],
      title: 'Hệ thống quản lý salon',
    }
  },
}
</script>

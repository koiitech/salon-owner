<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-list>
          <v-list-item v-for="(item, index) in businesses" :key="index">
            <v-list-item-content>{{item.name}}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import gql from 'graphql-tag'

export default {
   apollo: {
    businesses: {
      query: gql`query businesses {
        businesses {
          id
          name
        }
      }`
    }
  },
  data:() =>({
    businesses:[]
  })
}
</script>

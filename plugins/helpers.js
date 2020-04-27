import Vue from 'vue'


export default ({ env }, inject) => {
  Vue.filter('imgPath', val => {

    if (!val) {
      return ""
    }

    if (val.startsWith('http') || val.startsWith('data')) return val


    return env.API_URL + val
  })
}


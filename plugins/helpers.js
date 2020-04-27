import Vue from 'vue'



Vue.filter('imgPath', val => {
  console.log(process.env);

  if (val.startsWith('http') || val.startsWith('data')) {
    return val
  } else {
    return process.env.API_URL + val
  }
})

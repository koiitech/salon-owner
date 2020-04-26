export default function (context) {
  return {
    httpEndpoint: context.env.API_URL + '/graphql',
    // getAuth: () => 'Bearer my-static-token' // use this method to overwrite functions
  }
}
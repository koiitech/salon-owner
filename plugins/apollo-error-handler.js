export default ({ graphQLErrors, networkError, operation, forward }, nuxtContext) => {
  console.error('Global error handler')
  console.log({ graphQLErrors, networkError, operation, forward })
}

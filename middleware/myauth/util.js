export function routeOption(route, key, value, isClient) {
  return route.matched.some((m) => {
    if (isClient) {
      // Client
      return Object.values(m.components).some(
        component => component.options && component.options[key] === value
      )
    } else {
      // SSR
      return Object.values(m.components).some(component =>
        Object.values(component._Ctor).some(
          ctor => ctor.options && ctor.options[key] === value
        )
      )
    }
  })
}

export function getMatchedComponents(route, matches = []) {
  return [].concat.apply([], route.matched.map(function (m, index) {
    return Object.keys(m.components).map(function (key) {
      matches.push(index)
      return m.components[key]
    })
  }))
}
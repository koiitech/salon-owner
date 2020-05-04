import { routeOption, getMatchedComponents } from "./util";


export default function ({ app, route, redirect, isClient }) {

  console.log(app);

  // Disable middleware if options: { auth: false } is set on the route
  if (routeOption(route, 'auth', false, isClient)) {
    return true
  }

  // Disable middleware if no route was matched to allow 404/error page
  const matches = []
  const Components = getMatchedComponents(route, matches)
  if (!Components.length) {
    return true
  }

  if (!app.$apolloHelpers.getToken()) {
    return redirect('/login')
  }

  return true


}

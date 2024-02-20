export const getViewLink = (route: string, params?: Record<string, string>) => {
  let parsedRoute = route
  Object.keys(params || {}).forEach((key) => {
    if (!params?.[key]) return
    parsedRoute = parsedRoute.replace(`:${key}`, params?.[key])
  })
  return parsedRoute
}

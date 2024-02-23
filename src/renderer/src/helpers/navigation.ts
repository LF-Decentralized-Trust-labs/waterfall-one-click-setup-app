export const getViewLink = (route: string, params?: Record<string, string>) => {
  let parsedRoute = route
  Object.keys(params || {}).forEach((key) => {
    if (!params?.[key]) return
    parsedRoute = parsedRoute.replace(`:${key}`, params?.[key])
  })
  return parsedRoute
}

export const addParams = (route: string, params?: Record<string, string>) => {
  let parsedRoute = route
  Object.keys(params || {}).forEach((key, index) => {
    if (!params?.[key]) return
    if (index === 0) return (parsedRoute += `?${key}=${params[key]}`)
    parsedRoute += `&${key}=${params[key]}`
  })
  return parsedRoute
}

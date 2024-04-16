const root_routes = {
  nodes: 'nodes',
  workers: 'workers',
  statistics: 'statistics',
  settings: 'settings',
  changelog: 'changelog',
  notifications: 'notifications'
}

const sub_routes = {
  nodes: {
    list: `/${root_routes.nodes}/list`,
    view: `/${root_routes.nodes}/view/:id`,
    create: `/${root_routes.nodes}/create`
  },
  workers: {
    list: `/${root_routes.workers}/list`,
    view: `/${root_routes.workers}/view/:id`,
    add: `/${root_routes.workers}/add`,
    import: `/${root_routes.workers}/import`
  },
  statistics: {
    view: `/${root_routes.statistics}/view`
  },
  settings: `/settings`,
  changelog: `/changelog`,
  notifications: `/notifications`
}

const SearchKeys = {
  node: 'node',
  step: 'step'
}

export { sub_routes as routes, root_routes, SearchKeys }

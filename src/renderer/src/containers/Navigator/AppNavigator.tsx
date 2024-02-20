import { NodeListPage } from '@renderer/pages/NodesList'
import { Routes, Route, Navigate } from 'react-router-dom'
import { routes } from '@renderer/constants/navigation'
import { PageRender } from './NavigationWrapped'
import { AddNodePage } from '@renderer/pages/NodeAdd'
import { WorkersListPage } from '@renderer/pages/WorkersList'
import { StatisticsPage } from '@renderer/pages/Statistics'
import { NodeViewPage } from '@renderer/pages/NodeView'
import { DraftPage } from '@renderer/pages/Draft'

export const AppNavigator = () => {
  return (
    <Routes>
      <Route
        key="draft"
        path={routes.draft}
        element={
          <PageRender>
            <DraftPage />
          </PageRender>
        }
      />
      <Route
        key="nodes-list"
        path={routes.nodes.list}
        element={
          <PageRender>
            <NodeListPage />
          </PageRender>
        }
      />
      <Route
        key="nodes-view"
        path={routes.nodes.view}
        element={
          <PageRender>
            <NodeViewPage />
          </PageRender>
        }
      />
      <Route
        key="add-node"
        path={routes.nodes.create}
        element={
          <PageRender>
            <AddNodePage />
          </PageRender>
        }
      />
      <Route
        key="workers"
        path={routes.workers.list}
        element={
          <PageRender>
            <WorkersListPage />
          </PageRender>
        }
      />
      <Route
        key="statistics"
        path={routes.statistics.view}
        element={
          <PageRender>
            <StatisticsPage />
          </PageRender>
        }
      />
      <Route key="other" path={'*'} element={<Navigate to={routes.nodes.list} replace />} />,
    </Routes>
  )
}

import { NodeListPage } from '@renderer/pages/NodesList'
import { Routes, Route, Navigate } from 'react-router-dom'
import { routes } from '@renderer/constants/navigation'
import { PageRender } from './NavigationWrapped'
import { AddNodePage } from '@renderer/pages/NodeAdd'
import { WorkersListPage } from '@renderer/pages/WorkersList'
import { StatisticsPage } from '@renderer/pages/Statistics'
import { NodeViewPage } from '@renderer/pages/NodeView'
import { SettingsPage } from '@renderer/pages/Settings'
import { NotificationsPage } from '@renderer/pages/Notifications'
import { WorkerViewPage } from '@renderer/pages/WorkerView'
import { AddWorkerPage } from '@renderer/pages/WorkerAdd'
import { ImportWorkerPage } from '@renderer/pages/WorkersImport'

export const AppNavigator = () => {
  return (
    <Routes>
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
        key="worker-page"
        path={routes.workers.view}
        element={
          <PageRender>
            <WorkerViewPage />
          </PageRender>
        }
      />
      <Route
        key="add-worker"
        path={routes.workers.add}
        element={
          <PageRender>
            <AddWorkerPage />
          </PageRender>
        }
      />
      <Route
        key="import-worker"
        path={routes.workers.import}
        element={
          <PageRender>
            <ImportWorkerPage />
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
      <Route
        key="settings"
        path={routes.settings}
        element={
          <PageRender>
            <SettingsPage />
          </PageRender>
        }
      />
      <Route
        key="notifications"
        path={routes.notifications}
        element={
          <PageRender>
            <NotificationsPage />
          </PageRender>
        }
      />
      <Route key="other" path={'*'} element={<Navigate to={routes.nodes.list} replace />} />,
    </Routes>
  )
}

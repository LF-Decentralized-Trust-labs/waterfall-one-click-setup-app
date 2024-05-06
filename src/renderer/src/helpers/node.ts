import {
  Node,
  CoordinatorStatus,
  ValidatorStatus,
  Status,
  DownloadStatus,
  ActionMap,
  Action
} from '@renderer/types/node'

export const getNodeStatus = (node: Node) => {
  if (node.downloadStatus !== DownloadStatus.finish) {
    return node.downloadStatus
  } else if (
    node.coordinatorStatus === CoordinatorStatus.stopped &&
    node.validatorStatus === ValidatorStatus.stopped
  ) {
    return Status.stopped
  } else if (
    node.coordinatorStatus === CoordinatorStatus.syncing ||
    node.validatorStatus === ValidatorStatus.syncing
  ) {
    return Status.syncing
  }
  return Status.running
}

const StatusLabel = {
  [DownloadStatus.downloading]: 'Downloading',
  [DownloadStatus.downloadingPause]: 'Pause Download',
  [DownloadStatus.extracting]: 'Extracting',
  [DownloadStatus.extractingPause]: 'Pause Extract',
  [DownloadStatus.verifying]: 'Verifying',
  [DownloadStatus.verifyingPause]: 'Pause Verify',
  [Status.running]: 'Running',
  [Status.stopped]: 'Stopped',
  [Status.syncing]: 'Syncing'
}

export const getNodeStatusLabel = (node: Node) => {
  const status = getNodeStatus(node)
  if (status === DownloadStatus.downloading) {
    return `${StatusLabel[node.downloadStatus]} ${Math.floor((node.downloadBytes / node.downloadSize) * 100)}%`
  }
  return StatusLabel[status] || status
}

export const getActions = (node?: Node): ActionMap => {
  return {
    [Action.start]: node
      ? (node.downloadStatus === DownloadStatus.finish && getNodeStatus(node) === Status.stopped) ||
        getNodeStatus(node) === DownloadStatus.downloadingPause ||
        getNodeStatus(node) === DownloadStatus.extractingPause ||
        getNodeStatus(node) === DownloadStatus.verifyingPause
      : false,
    [Action.stop]: node
      ? (node.downloadStatus === DownloadStatus.finish && getNodeStatus(node) !== Status.stopped) ||
        getNodeStatus(node) === DownloadStatus.downloading ||
        getNodeStatus(node) === DownloadStatus.extracting ||
        getNodeStatus(node) === DownloadStatus.verifying
      : false,
    [Action.restart]: node?.downloadStatus === DownloadStatus.finish,
    [Action.remove]: node
      ? (node.downloadStatus === DownloadStatus.finish &&
          getNodeStatus(node) === Status.stopped &&
          node.workersCount === 0) ||
        getNodeStatus(node) === DownloadStatus.downloadingPause ||
        getNodeStatus(node) === DownloadStatus.extractingPause ||
        getNodeStatus(node) === DownloadStatus.verifyingPause
      : false
  }
}

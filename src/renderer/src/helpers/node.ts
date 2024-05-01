import {
  Node,
  CoordinatorStatus,
  ValidatorStatus,
  Status,
  DownloadStatus
} from '@renderer/types/node'

export const getNodeStatus = (node: Node) => {
  if (node.downloadStatus !== DownloadStatus.finish) {
    return node.downloadStatus === DownloadStatus.downloading
      ? `${node.downloadStatus} ${Math.floor((node.downloadBytes / node.downloadSize) * 100)}%`
      : node.downloadStatus
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

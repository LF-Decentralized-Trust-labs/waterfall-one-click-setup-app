import { Node, CoordinatorStatus, ValidatorStatus, Status } from '@renderer/types/node'

export const getNodeStatus = (node: Node) => {
  if (
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

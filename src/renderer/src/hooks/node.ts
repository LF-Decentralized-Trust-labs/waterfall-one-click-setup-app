import { getViewLink } from '@renderer/helpers/navigation'
import { routes } from '@renderer/constants/navigation'
import { AddNodeFields, Type, Network, NewNode, Ports } from '@renderer/types/node'
import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAll,
  getById,
  stop,
  start,
  restart,
  add,
  remove,
  checkPorts,
  getLastSnapshot
} from '@renderer/api/node'
import { selectDirectory } from '@renderer/api/os'
import {
  DEFAULT_WF_PATH,
  COORDINATOR_HTTP_API_PORT,
  COORDINATOR_HTTP_VALIDATOR_API_PORT,
  COORDINATOR_P2P_TCP_PORT,
  COORDINATOR_P2P_UDP_PORT,
  VALIDATOR_HTTP_API_PORT,
  VALIDATOR_P2P_PORT,
  VALIDATOR_WS_API_PORT
} from '@renderer/constants/env'
import { DownloadStatus } from '../types/node'

const initialPorts = {
  [AddNodeFields.coordinatorHttpApiPort]: Number(COORDINATOR_HTTP_API_PORT),
  [AddNodeFields.coordinatorHttpValidatorApiPort]: Number(COORDINATOR_HTTP_VALIDATOR_API_PORT),
  [AddNodeFields.coordinatorP2PTcpPort]: Number(COORDINATOR_P2P_TCP_PORT),
  [AddNodeFields.coordinatorP2PUdpPort]: Number(COORDINATOR_P2P_UDP_PORT),
  [AddNodeFields.validatorHttpApiPort]: Number(VALIDATOR_HTTP_API_PORT),
  [AddNodeFields.validatorP2PPort]: Number(VALIDATOR_P2P_PORT),
  [AddNodeFields.validatorWsApiPort]: Number(VALIDATOR_WS_API_PORT)
}
const initialValues = {
  [AddNodeFields.type]: Type.local,
  [AddNodeFields.network]: Network.testnet8,
  [AddNodeFields.locationDir]: DEFAULT_WF_PATH,
  [AddNodeFields.name]: '',
  [AddNodeFields.downloadStatus]: DownloadStatus.downloading,
  [AddNodeFields.downloadUrl]: null,
  [AddNodeFields.downloadHash]: null,
  [AddNodeFields.downloadSize]: 0,
  ...initialPorts
}

export const useGoNode = () => {
  const navigate = useNavigate()
  const goView = (id: number) => navigate(getViewLink(routes.nodes.view, { id: id.toString() }))
  return { goView }
}

const _checkPorts = async (values) => {
  const results = Object.keys(initialPorts).reduce((prev, curr) => ({ [curr]: false, ...prev }), {})
  const check = Object.keys(initialPorts).reduce(
    (prev, curr) => (values[curr] ? { ...prev, [curr]: values[curr] } : prev),
    {}
  )
  if (Object.values(check).length > 0) {
    const res = await checkPorts(Object.values(check))
    Object.keys(check).forEach((key, index) => (results[key] = res[index]))
  }
  return results
}
export const useAddNode = () => {
  const [isLoading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [values, setValues] = useState<NewNode>(initialValues)

  const { data: snapshot } = useQuery({
    queryKey: ['node:snapshot'],
    queryFn: async () => {
      return await getLastSnapshot()
    }
  })

  const { data: checkPorts } = useQuery({
    queryKey: ['node:checkPorts'],
    queryFn: async () => {
      return await _checkPorts(initialPorts)
    }
  })

  const mutationCheckPorts = useMutation({
    mutationFn: async ({ ports }: { ports: Ports }) => {
      return await _checkPorts(ports)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['node:checkPorts'], data)
    }
  })
  const handleChange = (field: AddNodeFields) => (value?: string | number | null) =>
    setValues((prev) => ({ ...prev, [field]: value }))

  const onAdd = async () => {
    setLoading(true)
    const node = await add(values)
    setTimeout(() => {
      setLoading(false)
      if (node?.id) {
        return navigate(getViewLink(routes.nodes.view, { id: node.id.toString() }))
      }
      alert(node)
    }, 10000)
  }

  const onSelectDirectory = useCallback(async () => {
    const locationDir = await selectDirectory(values[AddNodeFields.locationDir])
    if (!locationDir) {
      return
    }
    setValues((prev) => ({ ...prev, [AddNodeFields.locationDir]: locationDir }))
  }, [values, setValues])

  const onCheckPorts = useCallback(async () => {
    const ports = Object.keys(initialPorts).reduce(
      (prev, curr) => (values[curr] ? { [curr]: values[curr], ...prev } : prev),
      {}
    )
    if (Object.values(ports).length > 0) {
      await mutationCheckPorts.mutateAsync({ ports })
    }
  }, [values])

  const onSelectSnapshot = useCallback(() => {
    if (!snapshot) return
    setValues((prev) => ({
      ...prev,
      [AddNodeFields.downloadStatus]:
        prev[AddNodeFields.downloadStatus] === DownloadStatus.downloading
          ? DownloadStatus.finish
          : DownloadStatus.downloading,
      [AddNodeFields.downloadUrl]:
        prev[AddNodeFields.downloadStatus] === DownloadStatus.downloading ? null : snapshot.url,
      [AddNodeFields.downloadHash]:
        prev[AddNodeFields.downloadStatus] === DownloadStatus.downloading ? null : snapshot.hash,
      [AddNodeFields.downloadSize]:
        prev[AddNodeFields.downloadStatus] === DownloadStatus.downloading ? 0 : snapshot.size
    }))
  }, [snapshot])

  useEffect(() => {
    if (
      !snapshot ||
      values[AddNodeFields.downloadStatus] !== DownloadStatus.downloading ||
      (values[AddNodeFields.downloadUrl] && values[AddNodeFields.downloadHash])
    ) {
      return
    }
    setValues((prev) => ({
      ...prev,
      [AddNodeFields.downloadUrl]: snapshot.url,
      [AddNodeFields.downloadHash]: snapshot.hash,
      [AddNodeFields.downloadSize]: snapshot.size
    }))
  }, [snapshot, values])

  return {
    values,
    handleChange,
    onAdd,
    onSelectDirectory,
    onCheckPorts,
    checkPorts,
    isLoading,
    snapshot,
    onSelectSnapshot
  }
}

export const useGetAll = (options?: { refetchInterval?: number }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['node:all'],
    queryFn: getAll,
    refetchInterval: options?.refetchInterval
  })

  return { isLoading, data, error }
}

export const useGetById = (id?: string, options?: { refetchInterval?: number }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['node:one', id],
    queryFn: async () => {
      if (id) {
        return await getById(parseInt(id))
      }
      return undefined
    },
    refetchInterval: options?.refetchInterval
  })

  return { isLoading, data, error }
}

export const useControl = (id?: string) => {
  const [status, setStatus] = useState<null | 'start' | 'stop' | 'restart'>(null)
  const startMutation = useMutation({
    mutationFn: async (id: number) => {
      return await start(id)
    }
  })
  const stopMutation = useMutation({
    mutationFn: async (id: number) => {
      return await stop(id)
    }
  })

  const restartMutation = useMutation({
    mutationFn: async (id: number) => {
      return await restart(id)
    }
  })

  const onStart = useCallback(async () => {
    if (!id) {
      return
    }
    setStatus('start')
    await startMutation.mutateAsync(parseInt(id))
    setTimeout(() => {
      setStatus(null)
    }, 1000)
  }, [id])

  const onStop = useCallback(async () => {
    if (!id) {
      return
    }
    setStatus('stop')
    await stopMutation.mutateAsync(parseInt(id))
    setTimeout(() => {
      setStatus(null)
    }, 1000)
  }, [id])

  const onRestart = useCallback(async () => {
    if (!id) {
      return
    }
    setStatus('restart')
    await restartMutation.mutateAsync(parseInt(id))
    setTimeout(() => {
      setStatus(null)
    }, 1000)
  }, [id])

  return { onStart, onStop, onRestart, status }
}

export const useRemove = (id?: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [status, setStatus] = useState<boolean>(false)
  const [withData, onChangeWithData] = useState<boolean>(false)

  const removeMutation = useMutation({
    mutationFn: async ({ ids, withData }: { ids: number[]; withData: boolean }) => {
      return await remove(ids, withData)
    }
  })

  const onRemove = useCallback(
    async (callback: () => void) => {
      if (!id) {
        return
      }
      setStatus(true)
      await removeMutation.mutateAsync({ ids: [parseInt(id)], withData })
      await queryClient.invalidateQueries({ queryKey: ['node:all'] })
      await queryClient.invalidateQueries({ queryKey: ['node:one'] })
      setTimeout(() => {
        setStatus(false)
        callback()
        navigate(routes.nodes.list)
      }, 1000)
    },
    [id, withData]
  )
  return { onRemove, status, withData, onChangeWithData }
}

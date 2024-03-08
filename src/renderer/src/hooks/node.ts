import { getViewLink } from '@renderer/helpers/navigation'
import { routes } from '@renderer/constants/navigation'
import { AddNodeFields, Type, Network, NewNode } from '@renderer/types/node'
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAll, getById, stop, start, restart, add } from '@renderer/api/node'
import { selectDirectory } from '@renderer/api/os'
import { DEFAULT_WF_PATH } from '@renderer/constants/env'

const initialValues = {
  [AddNodeFields.type]: Type.local,
  [AddNodeFields.network]: Network.testnet8,
  [AddNodeFields.locationDir]: DEFAULT_WF_PATH,
  [AddNodeFields.name]: ''
}
export const useGoNode = () => {
  const navigate = useNavigate()
  const goView = (id: number) => navigate(getViewLink(routes.nodes.view, { id: id.toString() }))
  return { goView }
}
export const useAddNode = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState<NewNode>(initialValues)
  const handleChange = (field: AddNodeFields) => (value?: string) =>
    setValues((prev) => ({ ...prev, [field]: value }))

  const onAdd = async () => {
    const node = await add(values)
    console.log(node)
    if (node?.id) {
      return navigate(getViewLink(routes.nodes.view, { id: node.id.toString() }))
    }
    alert(node)
  }

  const onSelectDirectory = useCallback(async () => {
    const locationDir = await selectDirectory(values[AddNodeFields.locationDir])
    if (!locationDir) {
      return
    }
    setValues((prev) => ({ ...prev, [AddNodeFields.locationDir]: locationDir }))
  }, [values, setValues])
  return { values, handleChange, onAdd, onSelectDirectory }
}

export const useGetAll = () => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['node:all'],
    queryFn: getAll,
    refetchInterval: 5000
  })

  return { isLoading, data, error }
}

export const useGetById = (id?: string) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['node:one', id],
    queryFn: async () => {
      if (id) {
        return await getById(parseInt(id))
      }
      return undefined
    },
    refetchInterval: 1000
  })

  return { isLoading, data, error }
}

export const useControl = (id?: string) => {
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
    await startMutation.mutateAsync(parseInt(id))
  }, [id])

  const onStop = useCallback(async () => {
    if (!id) {
      return
    }
    await stopMutation.mutateAsync(parseInt(id))
  }, [id])

  const onRestart = useCallback(async () => {
    if (!id) {
      return
    }
    await restartMutation.mutateAsync(parseInt(id))
  }, [id])

  return { onStart, onStop, onRestart }
}

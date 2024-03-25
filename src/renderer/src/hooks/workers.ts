import { routes } from '@renderer/constants/navigation'
import { getViewLink, addParams } from '@renderer/helpers/navigation'
import {
  AddWorkerFields,
  AddWorkerFormValuesT,
  ImportWorkerFields,
  ImportWorkerFormValuesT
} from '@renderer/types/workers'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  genMnemonic,
  add as addWorkers,
  getAll,
  getById,
  getAllByNodeId,
  getActionTx
} from '../api/worker'
import { saveTextFile } from '../api/os'
import { Node } from '../types/node'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActionTxType } from '../types/workers'

const addInitialValues = {
  [AddWorkerFields.mnemonic]: [],
  [AddWorkerFields.mnemonicVerify]: Object.assign(
    {},
    Array.from(Array(24).keys()).map(() => '')
  ),
  [AddWorkerFields.amount]: 1,
  [AddWorkerFields.withdrawalAddress]: ''
}

export const useAddWorker = (node?: Node) => {
  const navigate = useNavigate()
  const [values, setValues] = useState<AddWorkerFormValuesT>({
    ...addInitialValues
  })

  const handleChangeNode = (value?: string) => {
    if (value) navigate(addParams(routes.workers.add, { node: value }))
  }

  useEffect(() => {
    const _genMnemonic = async () => {
      const phrase = await genMnemonic()
      const mnemonic = phrase.split(' ')
      const mnemonicVerify = Object.assign({}, mnemonic)
      //clear values
      mnemonicVerify[4] = ''
      mnemonicVerify[10] = ''
      mnemonicVerify[16] = ''
      mnemonicVerify[20] = ''
      setValues((prev) => ({ ...prev, mnemonic, mnemonicVerify }))
    }
    if (node && node.workersCount === 0) {
      _genMnemonic()
    } else {
      setValues((prev) => ({
        ...prev,
        mnemonic: addInitialValues[AddWorkerFields.mnemonic],
        mnemonicVerify: addInitialValues[AddWorkerFields.mnemonicVerify]
      }))
    }
  }, [node?.id])

  const handleChange =
    (field: AddWorkerFields) => (value?: string | Record<number, string> | number | null) =>
      setValues((prev) => ({ ...prev, [field]: value }))

  const handleSaveMnemonic = useCallback(async () => {
    await saveTextFile(values.mnemonic.join(' '), 'Save Mnemonic phrase to file', 'memo.txt')
  }, [values])

  const onAdd = useCallback(async () => {
    if (!node) {
      return
    }
    const workers = await addWorkers({
      nodeId: node.id,
      mnemonic: Object.values(values[AddWorkerFields.mnemonicVerify]).join(' '),
      amount: values[AddWorkerFields.amount],
      withdrawalAddress: values[AddWorkerFields.withdrawalAddress]
    })
    console.log(
      {
        nodeId: node.id,
        mnemonic: Object.values(values[AddWorkerFields.mnemonicVerify]).join(' '),
        amount: values[AddWorkerFields.amount],
        withdrawalAddress: values[AddWorkerFields.withdrawalAddress]
      },
      workers
    )
    if (workers?.length > 0) {
      return navigate(routes.workers.list)
    }
  }, [node?.id, values])

  return { values, handleChange, handleSaveMnemonic, onAdd, handleChangeNode }
}

const importInitialValues = {
  [ImportWorkerFields.node]: '1',
  [ImportWorkerFields.mnemonic]: {},
  [ImportWorkerFields.withdrawalAddress]: '',
  [ImportWorkerFields.keys]: ''
}

export const useImportWorker = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState<ImportWorkerFormValuesT>(importInitialValues)
  const handleChange =
    (field: ImportWorkerFields) => (value?: string | Record<number, string> | number | null) =>
      setValues((prev) => ({ ...prev, [field]: value }))

  const onAdd = () => {
    navigate(routes.workers.list)
  }
  return { values, handleChange, onAdd }
}

export const useGoWorker = () => {
  const navigate = useNavigate()
  const goView = (id: number) => navigate(getViewLink(routes.workers.view, { id: id.toString() }))
  return { goView }
}
export const useGetAll = (options?: { refetchInterval?: number }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['workers:all'],
    queryFn: getAll,
    refetchInterval: options?.refetchInterval
  })

  return { isLoading, data, error }
}

export const useGetAllByNodeId = (id?: string, options?: { refetchInterval?: number }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['workers:node', id],
    queryFn: async () => {
      if (id) {
        return await getAllByNodeId(parseInt(id))
      }
      return undefined
    },
    refetchInterval: options?.refetchInterval
  })

  return { isLoading, data, error }
}

export const useGetById = (id?: string, options?: { refetchInterval?: number }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['worker:one', id],
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

type ActionTxParams = {
  action: ActionTxType
  id?: string
  amount?: string
}
export const useActionTx = (action: ActionTxType | null, id?: string, amount?: string) => {
  const queryClient = useQueryClient()

  const { isLoading, data, error } = useQuery({
    queryKey: ['worker:actionTx', { id, action }],
    queryFn: async () => {
      if (id && action) {
        return await getActionTx(action, parseInt(id), amount)
      }
      return undefined
    }
  })

  const mutation = useMutation({
    mutationFn: async ({ action, id, amount }: ActionTxParams) => {
      if (id && action) {
        return await getActionTx(action, parseInt(id), amount)
      }
      return undefined
    },
    onSuccess: (data, { action, id }) => {
      queryClient.setQueryData(['worker:actionTx', { id, action }], data)
    }
  })

  const onUpdate = useCallback(
    async (amount?: string) => {
      if (!id || !action) {
        return
      }
      await mutation.mutateAsync({ action, id, amount })
    },
    [action, id]
  )

  return { isLoading, data, error, onUpdate }
}

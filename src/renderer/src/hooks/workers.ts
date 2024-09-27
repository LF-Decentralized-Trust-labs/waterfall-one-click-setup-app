/*
 * Copyright 2024   Blue Wave Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { routes } from '@renderer/constants/navigation'
import { getViewLink, addParams } from '@renderer/helpers/navigation'
import {
  AddWorkerFields,
  AddWorkerFormValuesT,
  ImportWorkerFields,
  ImportWorkerFormValuesT,
  DelegateRulesT
} from '@renderer/types/workers'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  genMnemonic,
  add as addWorkers,
  getAll,
  getById,
  getAllByNodeId,
  getActionTx,
  remove,
  sendActionTx,
  getDepositDataCount,
  getDelegateRules,
  getBalance
} from '../api/worker'
import { saveTextFile } from '../api/os'
import { Node } from '../types/node'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ActionTxType } from '../types/workers'
import { selectFile } from '../api/os'
import { chunkArray } from '../helpers/common'
import { ethers } from 'ethers'
const chunkSize = 10

const addInitialValues = {
  [AddWorkerFields.mnemonic]: [],
  [AddWorkerFields.mnemonicVerify]: Object.assign(
    {},
    Array.from(Array(24).keys()).map(() => '')
  ),
  [AddWorkerFields.amount]: 1,
  [AddWorkerFields.withdrawalAddress]: '',
  [AddWorkerFields.depositData]: '',
  [AddWorkerFields.delegateRules]: ''
}

export const useAddWorker = (node?: Node, mode: 'add' | 'import' = 'add') => {
  const [isLoading, setLoading] = useState(false)
  const [deposit, setDeposit] = useState<{
    depositDataCount: number
    delegateRules?: DelegateRulesT
  }>({ depositDataCount: 0, delegateRules: undefined })
  const [error, setError] = useState<string | undefined>(undefined)
  const navigate = useNavigate()
  const [values, setValues] = useState<AddWorkerFormValuesT>({
    ...addInitialValues
  })

  const handleChangeNode = (value?: string) => {
    if (value) navigate(addParams(routes.workers.add, { node: value, mode }))
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
    if (node && node.workersCount === 0 && mode !== 'import') {
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

  const onSelectFile =
    (field: AddWorkerFields.depositData | AddWorkerFields.delegateRules) => async () => {
      const filePath = await selectFile(undefined, [{ name: 'JSON Files', extensions: ['json'] }])
      if (!filePath) {
        return
      }
      if (field === AddWorkerFields.depositData) {
        const depositDataCount = await getDepositDataCount(filePath)
        setDeposit((prev) => ({ ...prev, depositDataCount }))
      } else if (field === AddWorkerFields.delegateRules) {
        const delegateRules = await getDelegateRules(filePath)
        setDeposit((prev) => ({ ...prev, delegateRules }))
      }
      setValues((prev) => ({ ...prev, [field]: filePath }))
    }

  const onAdd = useCallback(async () => {
    if (!node) {
      return
    }
    setLoading(true)

    const result = await addWorkers({
      nodeId: node.id,
      mnemonic: Object.values(values[AddWorkerFields.mnemonicVerify]).join(' '),
      amount: values[AddWorkerFields.amount],
      withdrawalAddress: values[AddWorkerFields.withdrawalAddress],
      depositData: values[AddWorkerFields.depositData],
      delegateRules: values[AddWorkerFields.delegateRules]
    })
    setLoading(false)
    if (result.status === 'error') {
      setError(result.message || 'An error occurred')
      return
    }
    if (result.status === 'success') {
      setError(undefined)
      return navigate(routes.workers.list)
    }
  }, [node?.id, values])

  return {
    values,
    handleChange,
    handleSaveMnemonic,
    onSelectFile,
    deposit,
    onAdd,
    handleChangeNode,
    isLoading,
    error
  }
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

export const useRemove = (id?: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [status, setStatus] = useState<boolean>(false)

  const removeMutation = useMutation({
    mutationFn: async ({ ids }: { ids: number[] }) => {
      return await remove(ids)
    }
  })

  const onRemove = useCallback(
    async (callback: () => void) => {
      if (!id) {
        return
      }
      setStatus(true)
      await removeMutation.mutateAsync({ ids: [parseInt(id)] })
      await queryClient.invalidateQueries({ queryKey: ['workers:all'] })
      await queryClient.invalidateQueries({ queryKey: ['worker:one'] })
      setTimeout(() => {
        setStatus(false)
        callback()
        navigate(routes.workers.list)
      }, 1000)
    },
    [id]
  )
  return { onRemove, status }
}

export const useMassAction = (type: ActionTxType | null, from: string[] | null) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [pk, setPk] = useState<{
    key: string
    address: string
    isCorrect: boolean | null
    balance: string
  }>({
    key: '',
    address: '',
    isCorrect: null,
    balance: ''
  })
  const [status, setStatus] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [count, setCount] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 })

  const onClear = () => {
    setError('')
    setCount({ success: 0, failed: 0 })
    setPk({ key: '', address: '', isCorrect: null, balance: '' })
    setStatus(false)
  }

  const onChangePk = async (key: string) => {
    let address = ''
    let isCorrect = false
    try {
      const wallet = new ethers.Wallet(key)
      address = wallet.address
      if (type === ActionTxType.withdraw || type === ActionTxType.deActivate) {
        isCorrect = !!(from && from.includes(wallet.address.toLowerCase()))
      } else {
        isCorrect = true
      }
    } catch (e) {
      console.error(e)
    }
    let balance = ''
    if (address) {
      balance = await getBalance(address)
    }
    setPk({ key, address, isCorrect, balance })
  }
  const removeMutation = useMutation({
    mutationFn: async ({ ids }: { ids: (number | bigint)[] }) => {
      return await remove(ids)
    }
  })
  const onRemove = async (callback: () => void, ids: (number | bigint)[]) => {
    if (!ids) {
      return
    }
    setStatus(true)
    const chunkedArray = chunkArray(ids, chunkSize)
    for (const chunk of chunkedArray) {
      const res = await removeMutation.mutateAsync({ ids: chunk })
      if (res?.error) {
        setError(res.error)
        return
      }
      setCount((prev) => ({
        success: prev.success + res.filter((v) => v).length,
        failed: res.filter((v) => !v).length
      }))
    }

    await queryClient.invalidateQueries({ queryKey: ['workers:all'] })
    await queryClient.invalidateQueries({ queryKey: ['worker:one'] })
    setTimeout(() => {
      setStatus(false)
      callback()
      navigate(routes.workers.list)
    }, 1000)
  }

  const activateMutation = useMutation({
    mutationFn: async ({ ids, pk }: { ids: (number | bigint)[]; pk: string }) => {
      return await sendActionTx(ActionTxType.activate, ids, pk)
    }
  })
  const onActivate = async (ids: (number | bigint)[]) => {
    if (!ids || ids.length == 0 || !pk.key) {
      return
    }
    setStatus(true)
    const chunkedArray = chunkArray(ids, chunkSize)
    for (const chunk of chunkedArray) {
      const res = await activateMutation.mutateAsync({ ids: chunk, pk: pk.key })
      if (res?.error) {
        setError(res.error)
      }
      setCount((prev) => ({
        success: prev.success + res.filter((v) => v).length,
        failed: res.filter((v) => !v).length
      }))
    }

    setStatus(false)
  }

  const deActivateMutation = useMutation({
    mutationFn: async ({ ids, pk }: { ids: (number | bigint)[]; pk: string }) => {
      return await sendActionTx(ActionTxType.deActivate, ids, pk)
    }
  })
  const onDeActivate = async (ids: (number | bigint)[]) => {
    if (!ids || ids.length == 0 || !pk.key) {
      return
    }
    setStatus(true)

    const chunkedArray = chunkArray(ids, chunkSize)
    for (const chunk of chunkedArray) {
      const res = await deActivateMutation.mutateAsync({ ids: chunk, pk: pk.key })
      if (res?.error) {
        setError(res.error)
      }
      setCount((prev) => ({
        success: prev.success + res.filter((v) => v).length,
        failed: res.filter((v) => !v).length
      }))
    }

    setStatus(false)
  }
  const withdrawMutation = useMutation({
    mutationFn: async ({ ids, pk }: { ids: (number | bigint)[]; pk: string }) => {
      return await sendActionTx(ActionTxType.withdraw, ids, pk)
    }
  })
  const onWithdraw = async (ids: (number | bigint)[]) => {
    if (!ids || ids.length == 0 || !pk.key) {
      return
    }
    setStatus(true)

    const chunkedArray = chunkArray(ids, chunkSize)
    for (const chunk of chunkedArray) {
      const res = await withdrawMutation.mutateAsync({ ids: chunk, pk: pk.key })
      if (res?.error) {
        setError(res.error)
      }
      setCount((prev) => ({
        success: prev.success + res.filter((v) => v).length,
        failed: res.filter((v) => !v).length
      }))
    }

    setStatus(false)
  }

  return {
    onRemove,
    onActivate,
    onDeActivate,
    onWithdraw,
    status,
    error,
    count,
    onClear,
    onChangePk,
    pk
  }
}

import { routes } from '@renderer/constants/navigation'
import { shuffleArray } from '@renderer/helpers/common'
import {
  AddWorkerFields,
  AddWorkerFormValuesT,
  ImportWorkerFields,
  ImportWorkerFormValuesT
} from '@renderer/types/workers'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const addInitialValues = {
  [AddWorkerFields.node]: '1',
  [AddWorkerFields.mnemonic]: [],
  [AddWorkerFields.mnemonicVerify]: Object.assign(
    {},
    Array.from(Array(24).keys()).map(() => '')
  ),
  [AddWorkerFields.amount]: null,
  [AddWorkerFields.withdrawalAddress]: '',
  [AddWorkerFields.keys]: ''
}

export const useAddWorker = () => {
  const phrase = useMemo(
    () => shuffleArray(Array.from(Array(24).keys()).map((_, index) => `Word${index}`)),
    []
  )
  const mnemonicVerify = Object.assign({}, phrase)
  //clear values
  mnemonicVerify[4] = ''
  mnemonicVerify[10] = ''
  mnemonicVerify[16] = ''
  mnemonicVerify[20] = ''

  const navigate = useNavigate()
  const [values, setValues] = useState<AddWorkerFormValuesT>({
    ...addInitialValues,
    mnemonic: phrase,
    mnemonicVerify: mnemonicVerify
  })
  const handleChange =
    (field: AddWorkerFields) => (value?: string | Record<number, string> | number | null) =>
      setValues((prev) => ({ ...prev, [field]: value }))

  const onAdd = () => {
    navigate(routes.workers.list)
  }
  return { values, handleChange, onAdd }
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

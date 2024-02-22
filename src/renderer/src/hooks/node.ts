import { routes } from '@renderer/constants/navigation'
import { AddNodeFields, AddNodeFormValuesT, NODE_TYPE } from '@renderer/types/node'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialValues = {
  [AddNodeFields.type]: NODE_TYPE.local,
  [AddNodeFields.network]: 'mainnet',
  [AddNodeFields.dataFolder]: '',
  [AddNodeFields.name]: ''
}

export const useAddNode = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState<AddNodeFormValuesT>(initialValues)
  const handleChange = (field: AddNodeFields) => (value?: string) =>
    setValues((prev) => ({ ...prev, [field]: value }))

  const onAdd = () => {
    alert(`Node ${values.name} has been created!`)
    navigate(routes.nodes.list)
  }
  return { values, handleChange, onAdd }
}

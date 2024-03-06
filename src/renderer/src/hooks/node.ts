import { getViewLink } from '@renderer/helpers/navigation'
import { routes } from '@renderer/constants/navigation'
import { AddNodeFields, AddNodeFormValuesT, NODE_TYPE } from '@renderer/types/node'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAll } from '@renderer/api/node'

const initialValues = {
  [AddNodeFields.type]: NODE_TYPE.local,
  [AddNodeFields.network]: 'mainnet',
  [AddNodeFields.dataFolder]: '',
  [AddNodeFields.name]: ''
}

export const useGoNode = () => {
  const navigate = useNavigate()
  const goView = (id: number) => navigate(getViewLink(routes.nodes.view, { id: id.toString() }))
  return { goView }
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

export const useGetAll = () => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['node:all'],
    queryFn: getAll
  })

  return { isLoading, data, error }
}

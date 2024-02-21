import { routes } from '@renderer/constants/navigation'
import { CreateNodeFields, CreateNodeFormValuesT } from '@renderer/types/node'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialValues = {
  [CreateNodeFields.network]: 'mainnet',
  [CreateNodeFields.dataFolder]: '',
  [CreateNodeFields.name]: ''
}

export const useCreateNode = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState<CreateNodeFormValuesT>(initialValues)
  const handleChange = (field: CreateNodeFields) => (value?: string) =>
    setValues((prev) => ({ ...prev, [field]: value }))

  const onCreate = () => {
    alert(`Node ${values.name} has been created!`)
    navigate(routes.nodes.list)
  }
  return { values, handleChange, onCreate }
}

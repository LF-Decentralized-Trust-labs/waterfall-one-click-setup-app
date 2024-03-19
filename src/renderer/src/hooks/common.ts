import { useEffect, useState } from 'react'

export const useCopy = (text?: string): [boolean, () => void] => {
  const [status, setStatus] = useState(false)
  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text)
      setStatus(true)
      return true
    }
    return false
  }
  useEffect(() => {
    status && setTimeout(() => setStatus(false), 2500)
  }, [status])
  return [status, handleCopy]
}

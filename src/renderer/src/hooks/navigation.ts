import { useNavigate } from 'react-router-dom'
import { getViewLink } from '@renderer/helpers/navigation'
import { openExternal } from '../api/os'
export const useNavigation = () => {
  const navigate = useNavigate()
  const goRoute = (route: string, params?: Record<string, string>) =>
    navigate(getViewLink(route, params))
  const goBrowser = (url: string) => openExternal(url)
  return { goRoute, goBrowser }
}

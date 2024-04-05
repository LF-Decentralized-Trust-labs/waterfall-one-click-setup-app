import { Space } from 'antd'
import { Title } from '@renderer/ui-kit/Typography'
import { styled } from 'styled-components'
import { LoadingOutlined } from '@ant-design/icons'
export const Content = () => {
  return (
    <Space direction="vertical" size="middle" align="center">
      <Loading />
      <Title>Page Under Construction</Title>
      <p>We are working on something amazing. Stay tuned!</p>
    </Space>
  )
}

const Loading = styled(LoadingOutlined)`
  font-size: 48px;
`

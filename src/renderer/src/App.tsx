import { Layout, Typography, Flex, Button } from 'antd'
import styled from 'styled-components'
import { SettingOutlined, BellOutlined, HomeOutlined, ReadOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { start, stop } from './api'

import LogoSrc from './assets/logo.svg'

const { Header, Content, Footer, Sider } = Layout
const { Text } = Typography
const AppLayout = styled(Layout)`
  min-height: 100vh;
`

const AppHeader = styled(Header)`
  height: 40px;
  background-color: #1677ff;
  padding: 0;
  -webkit-app-region: drag;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 80px;
`

const AppFooter = styled(Footer)`
  height: 20px;
  background-color: #00C1B0;
  padding: 0;
`
const AppTitle = styled(Text)`
  color: rgba(255, 255, 255, 0.87) !important;
  padding: 0 8px;
`
const AppLogo = styled.img.attrs({ src: LogoSrc, width: 24, height: 24 })`
`

function App(): JSX.Element {
  return (
    <AppLayout>
      <AppHeader>
        <Flex justify={'space-between'} align={'center'}>
          <AppLogo />
          <AppTitle>Waterfall App</AppTitle>
        </Flex>

        <Flex justify={'space-between'} align={'center'}>
          <Button type="primary" shape="circle" size={'small'} icon={<HomeOutlined />} />
          <Button type="primary" shape="circle" size={'small'} icon={<QuestionCircleOutlined />} />
          <Button type="primary" shape="circle" size={'small'} icon={<ReadOutlined />} />
          <Button type="primary" shape="circle" size={'small'} icon={<SettingOutlined />} />
          <Button type="primary" shape="circle" size={'small'} icon={<BellOutlined />} />
        </Flex>
      </AppHeader>
      <Layout>
        <Sider>Sider</Sider>
        <Content>
          <button onClick={() => start()}>start</button>
          <button onClick={() => stop()}>stop</button>
        </Content>
      </Layout>
      <AppFooter>footer</AppFooter>
    </AppLayout>

  )
}

export default App

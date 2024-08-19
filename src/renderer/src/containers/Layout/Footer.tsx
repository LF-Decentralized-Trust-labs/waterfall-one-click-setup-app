import { FooterComponent } from '@renderer/components/Layout/Footer'
import { IconButton } from '@renderer/ui-kit/Button'
import { Text } from '@renderer/ui-kit/Typography'
import { Flex, Popover } from 'antd'
import {
  // PauseOutlined,
  // CaretRightOutlined,
  // PoweroffOutlined,
  BellOutlined
} from '@ant-design/icons'
import { styled } from 'styled-components'
import { FOOTER_HEIGHT } from '@renderer/constants/layout'
import { useFetchState } from '@renderer/hooks/app'
import { useNavigation } from '../../hooks/navigation'
import { routes } from '../../constants/navigation'
export const Footer = () => {
  const { goRoute } = useNavigation()
  const { isLoading, data: state, error } = useFetchState()

  if (isLoading || error) {
    return null
  }

  return (
    <FooterComponent
      // leftSide={
      //   <Flex justify="space-around" align="center">
      //     <Text color="white" size="sm">
      //       Running
      //     </Text>
      //     <Actions gap={2} align="center">
      //       <IconButton icon={<CaretRightOutlined />} size="small" shape="default" />
      //       <IconButton icon={<PauseOutlined />} size="small" shape="default" />
      //       <IconButton icon={<PoweroffOutlined />} size="small" shape="default" disabled />
      //     </Actions>
      //   </Flex>
      // }
      // centerSide={
      //   <MainInfo align="center">
      //     <Popover
      //       placement="topRight"
      //       title={'Node Info'}
      //       content={
      //         <Flex vertical>
      //           <Text size="sm">
      //             Coordinator: <Text size="sm">10 / 20</Text>
      //           </Text>
      //           <Text size="sm">
      //             Validator: <Text size="sm">10 / 20</Text>
      //           </Text>
      //         </Flex>
      //       }
      //     >
      //       <Text size="sm">Node 105</Text>
      //     </Popover>
      //   </MainInfo>
      // }
      rightSide={
        <RightInfo gap={20} align="center">
          <Text size="sm">{state?.version}</Text>
          <Popover
            placement="topRight"
            title={'App Notifications'}
            content={'There are no updates here'}
          >
            <IconButton
              onClick={() => goRoute(routes.notifications)}
              icon={<BellOutlined />}
              size="small"
              shape="default"
              ghost
            />
          </Popover>
        </RightInfo>
      }
    />
  )
}

// const Actions = styled(Flex)`
//   height: ${FOOTER_HEIGHT}px;
//   button {
//     border: none;
//   }
// `

const RightInfo = styled(Flex)`
  height: ${FOOTER_HEIGHT}px;
  .ant-btn {
    border: none;
  }
`

// const MainInfo = styled(Flex)`
//   height: ${FOOTER_HEIGHT}px;
//   .ant-btn {
//     border: none;
//   }
// `

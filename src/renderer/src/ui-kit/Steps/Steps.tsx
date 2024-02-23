import { Steps, StepsProps } from 'antd'
import React from 'react'
import { styled } from 'styled-components'

export const StepsWithActiveContent: React.FC<StepsProps> = ({ ...props }) => {
  return <StyledSteps {...props} />
}

const StyledSteps = styled(Steps)`
  .ant-steps-item-description {
    display: none !important;
  }
  .ant-steps-item-active {
    .ant-steps-item-content .ant-steps-item-description {
      display: block !important;
    }
  }
`

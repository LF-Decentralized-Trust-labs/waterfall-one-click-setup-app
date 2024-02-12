import React, { PropsWithChildren } from 'react'
import { Layout } from 'antd'
import { styled } from 'styled-components'

type BodyPropsT = PropsWithChildren

export const BodyComponent: React.FC<BodyPropsT> = ({ children }) => {
  return <StyledLayout>{children}</StyledLayout>
}

const StyledLayout = styled(Layout)``

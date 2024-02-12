import React from 'react'
import { Layout } from 'antd'
import { styled } from 'styled-components'

export const FooterComponent = () => {
  return <StyledFooter></StyledFooter>
}

const StyledFooter = styled(Layout.Footer)`
  height: 20px;
  background-color: ${({theme}) => theme.palette.background.white};
  border-top: 1px solid ${({theme}) => theme.palette.common.black};
  padding: 0;
`

import React, { PropsWithChildren } from 'react'
import { styled } from 'styled-components'

export const PageBody: React.FC<PropsWithChildren> = ({children}) => {
  return <StyledWrapper>{children}</StyledWrapper>
}

const StyledWrapper = styled.div`
  box-sizing: border-box;
  padding: 30px 40px 20px 40px;
`

import { FOOTER_HEIGHT } from '@renderer/constants/layout'
import { Layout } from 'antd'
import React from 'react'
import { styled } from 'styled-components'

type PropsT = {
  leftSide?: React.ReactNode
  centerSide?: React.ReactNode
  rightSide?: React.ReactNode
}

export const FooterComponent: React.FC<PropsT> = ({ leftSide, centerSide, rightSide }) => {
  return (
    <StyledFooter>
      <SidePart>{leftSide}</SidePart>
      <Main>
        <Centered>{centerSide}</Centered>
        <Right>{rightSide}</Right>
      </Main>
    </StyledFooter>
  )
}

const StyledFooter = styled(Layout.Footer)`
  height: ${FOOTER_HEIGHT}px;
  background-color: ${({ theme }) => theme.palette.background.gray};
  color: ${({ theme }) => theme.palette.text.black};
  padding: 0 10px 0 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
`

const SidePart = styled.div`
  background-color: ${({ theme }) => theme.palette.background.blue};
  width: 200px;
  height: 100%;
`

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 0 6px 0 10px;
`

const Centered = styled.div``

const Right = styled.div``

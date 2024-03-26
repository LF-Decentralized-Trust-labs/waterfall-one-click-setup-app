import React, { PropsWithChildren } from 'react'
import { Spin } from 'antd'
import { styled } from 'styled-components'

type PageBodyType = PropsWithChildren & {
  isLoading?: boolean
}
export const PageBody: React.FC<PageBodyType> = ({ isLoading, children }) => {
  if (isLoading)
    return (
      <StyledWrapper>
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      </StyledWrapper>
    )
  return <StyledWrapper>{children}</StyledWrapper>
}

const StyledWrapper = styled.div`
  padding: 30px 40px 20px 40px;
  box-sizing: border-box;
  overflow: auto;
`

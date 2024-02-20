import { Layout } from 'antd'
import { styled } from 'styled-components'

export const FooterComponent = () => {
  return (
    <StyledFooter>
      <SidePart /> v1.1
    </StyledFooter>
  )
}

const StyledFooter = styled(Layout.Footer)`
  height: 20px;
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

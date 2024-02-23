import { styled } from 'styled-components'
import { Button } from 'antd'

export const StyledArrowButton = styled(Button)`
  width: 25px;
  height: 24px;
  border: none;
  background-color: transparent;
  box-shadow: none;
`

export const StyledButton = styled(Button)`
  height: 40px;
  display: flex;
  align-items: center;

  font-size: 14px;

  .anticon {
    font-size: 22px;
  }
`

export const StyledTextButton = styled(Button)`
  height: 40px;
  display: flex;
  align-items: center;

  font-size: 14px;
  color: ${({theme}) => theme.palette.text.blue};
  .anticon {
    font-size: 22px;
  }
`
import { styled } from 'styled-components'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

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
  & > a {
  }
  .anticon {
    font-size: 22px;
  }
`

export const StyledLink = styled(Link)`
  height: 40px;
  padding: 8px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  text-decoration: none;
  gap: 8px;
  font-size: 14px;

  border: none !important;
  background-color: ${({ theme }) => theme.palette.background.blue};
  border-radius: 6px;
  color: ${({ theme }) => theme.palette.text.white};
  &:hover {
    color: ${({ theme }) => theme.palette.text.white};
  }
  .anticon {
    font-size: 22px;
  }
`

export const StyledTextButton = styled(Button)`
  height: 40px;
  display: flex;
  align-items: center;

  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.blue};
  .anticon {
    font-size: 22px;
  }
`

import React from 'react'
import { MenuItemT } from '@renderer/types/navigation'
import { Link } from '@renderer/ui-kit/Link'
import { Text } from '@renderer/ui-kit/Typography'
import { css, styled } from 'styled-components'

type MenuPropsT = {
  menuItems: MenuItemT[]
  active?: string
}

export const Menu: React.FC<MenuPropsT> = ({ menuItems, active }) => {
  return (
    <MenuWrapper>
      {menuItems?.map((el) => (
        <MenuItem key={el?.key} $isActive={active === el?.key} to={el.link}>
          {el?.icon} <Text>{el?.title}</Text>
        </MenuItem>
      ))}
    </MenuWrapper>
  )
}

const MenuWrapper = styled.div`
  margin-top: 15px;
`

const activeStyles = css`
  font-weight: bold;
  opacity: 1;
`

const MenuItem = styled(Link)<{ $isActive?: boolean }>`
  width: 100%;
  height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 16px;

  font-size: 16px;
  font-weight: 400;

  opacity: 0.7;
  ${({ $isActive }) => $isActive && activeStyles}

  span {
    color: ${({ theme }) => theme.palette.text.black};
  }
  //icon
  .anticon {
    font-size: 19px;
    color: ${({ theme }) => theme.palette.text.black} !important;
  }
`

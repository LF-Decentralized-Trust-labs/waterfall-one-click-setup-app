import { MenuItemT } from '@renderer/types/navigation'
import { Link } from '@renderer/ui-kit/Link'
import { Text } from '@renderer/ui-kit/Typography'
import React from 'react'
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
  margin-top: 50px;

  display: flex;
  flex-direction: column;

  gap: 20px;
  min-width: 110px;
`

const activeStyles = css`
  font-weight: bold;
`

const MenuItem = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text.black};

  ${({ $isActive }) => $isActive && activeStyles}

  //icon
  .anticon {
    font-size: 19px;
    color: ${({ theme }) => theme.palette.text.black} !important;
  }
  min-width: 110px;
`

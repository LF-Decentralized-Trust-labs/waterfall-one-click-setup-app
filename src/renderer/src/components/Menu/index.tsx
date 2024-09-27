/*
 * Copyright 2024   Blue Wave Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
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

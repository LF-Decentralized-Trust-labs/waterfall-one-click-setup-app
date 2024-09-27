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
import { Breadcrumb as AntBreadcrumb } from 'antd'
import React from 'react'
import { styled } from 'styled-components'
import { Link } from '../Link'
import { Title } from '../Typography'

export type Item = {
  title: string
  link?: string
}
type BreadcrumbProps = {
  items: Item[]
}
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <AntBreadcrumb
      separator={<StyledTitle level={4}>/</StyledTitle>}
      items={items.map(({ title, link }) => ({
        title: link ? (
          <StyledLink to={link}>
            <StyledTitle level={4}>{title}</StyledTitle>
          </StyledLink>
        ) : (
          <StyledTitle level={4}>{title}</StyledTitle>
        )
      }))}
    />
  )
}

const StyledLink = styled(Link)`
  text-decoration: none !important;
  user-select: none !important;
  height: auto !important;
  &:hover {
    background-color: inherit !important;
  }
`
const StyledTitle = styled(Title)`
  margin-bottom: 0;
`

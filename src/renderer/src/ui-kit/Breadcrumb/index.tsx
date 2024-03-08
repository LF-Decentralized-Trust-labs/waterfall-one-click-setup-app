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

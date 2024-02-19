import React from 'react'
import { LinkProps, Link as RouterLink } from 'react-router-dom'
import { styled } from 'styled-components'

export const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  return <StyledLink {...props}>{children}</StyledLink>
}

const StyledLink = styled(RouterLink)`
    text-decoration: none !important;
    user-select: none !important;
    &:hover {
        border-bottom: none;
    }
    color: ${({theme}) => theme.palette.text.blue}
`

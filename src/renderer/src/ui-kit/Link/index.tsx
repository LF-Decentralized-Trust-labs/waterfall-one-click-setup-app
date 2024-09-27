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
  color: ${({ theme }) => theme.palette.text.blue};
`

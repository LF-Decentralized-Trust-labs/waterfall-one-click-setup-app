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
import { ArrowedButton } from '@renderer/ui-kit/Button'
import { Title } from '@renderer/ui-kit/Typography'
import { Breadcrumb, Item as BreadcrumbItem } from '@renderer/ui-kit/Breadcrumb'
import React from 'react'
import { styled } from 'styled-components'

type PageHeaderPropsT = {
  title?: string
  goBack?: () => void
  breadcrumb?: BreadcrumbItem[]
  actions?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderPropsT> = ({ title, breadcrumb, goBack, actions }) => {
  return (
    <Wrapper>
      {goBack && (
        <GoBack>
          <ArrowedButton direction="back" onClick={goBack} />
        </GoBack>
      )}
      {breadcrumb ? <Breadcrumb items={breadcrumb} /> : <PageTitle level={3}>{title}</PageTitle>}
      {actions && <Actions>{actions}</Actions>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 40px 30px 40px;

  position: relative;
`

const GoBack = styled.div`
  width: 60px;
`

const Actions = styled.div`
  position: absolute;
  right: 14px;
  display: flex;
`

const PageTitle = styled(Title)`
  margin: 0 !important;
  padding: 0 !important;
  font-weight: 400;
`

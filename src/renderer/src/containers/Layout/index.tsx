import { LayoutWrapper } from '@renderer/components/Layout/Layout'
import React, { PropsWithChildren } from 'react'
import { Header } from './Header'
// import { Footer } from './Footer'
import { BodyComponent } from '@renderer/components/Layout/Body'

type AppLayoutPropsT = PropsWithChildren

export const AppLayout: React.FC<AppLayoutPropsT> = ({ children }) => {
  return (
    <LayoutWrapper>
      <Header />
      <BodyComponent>{children}</BodyComponent>
      {/*<Footer />*/}
    </LayoutWrapper>
  )
}

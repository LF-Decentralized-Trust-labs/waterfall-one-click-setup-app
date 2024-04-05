import { Layout } from 'antd'
import { PageHeader } from '../Page/Header'
import { Content } from './Content'

export const Page = ({ title }) => {
  return (
    <Layout>
      <PageHeader title={title} />
      <Content />
    </Layout>
  )
}

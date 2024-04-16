import { PageHeader } from '@renderer/components/Page/Header'
import { PageBody } from '@renderer/components/Page/Body'
import { Layout, Timeline } from 'antd'
import { Text } from '../../ui-kit/Typography'

const breadcrumb = [
  {
    title: 'Changelog'
  }
]
const items = [
  {
    children: (
      <>
        <Text size="sm">0.3.2 - 16.04.2024</Text>
        <p>New: MacOs signing app</p>
        <p>New: Adding a changelog page</p>
        <p>Fix: Adding additional workers</p>
      </>
    )
  },
  {
    children: (
      <>
        <Text size="sm">0.3.1 - 15.04.2024</Text>
        <p>Improve: Adding an auto update feature</p>
      </>
    )
  },
  {
    children: (
      <>
        <Text size="sm">0.3.0 - 15.04.2024</Text>
        <p>New: Adding an auto update feature</p>
        <p>New: Adding App version to Status Bar</p>
      </>
    )
  },
  {
    children: (
      <>
        <Text size="sm">0.2.1 - 10.04.2024</Text>
        <p>Improve: Save all errors to log file without alert</p>
        <p>Fix: Get Validator status</p>
      </>
    )
  },
  {
    children: (
      <>
        <Text size="sm">0.2.0 - 05.04.2024</Text>
        <p>New: Initial Public release</p>
      </>
    )
  }
]
export const ChangelogPage = () => {
  return (
    <Layout>
      <PageHeader breadcrumb={breadcrumb} />
      <PageBody>
        <Timeline items={items} mode="left" />
      </PageBody>
    </Layout>
  )
}

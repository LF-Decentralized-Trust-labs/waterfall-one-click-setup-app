import { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { PageHeader } from '@renderer/components/Page/Header'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { start, stop, getAll, Node } from '@renderer/api/node'

export const DraftPage = () => {
  const [nodes, setNodes] = useState<Node[]>([])
  useEffect(() => {
    const getNodes = async () => {
      const nodes = await getAll()
      setNodes(nodes)
    }
    getNodes()
  }, [])

  return (
    <Layout>
      <PageHeader title="Draft" />
      {nodes.map((node) => (
        <p key={node.id}>
          {node.name}
          <>
            <ButtonPrimary onClick={() => start(1)}>
              Start <PlayCircleOutlined />
            </ButtonPrimary>
            <ButtonPrimary onClick={() => stop(1)}>
              Stop <PauseCircleOutlined />
            </ButtonPrimary>
          </>
        </p>
      ))}
    </Layout>
  )
}

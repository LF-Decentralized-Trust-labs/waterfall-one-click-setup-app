import { useCallback, useEffect, useState } from 'react'
import { Layout } from 'antd'
import { PauseCircleOutlined, PlayCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { PageHeader } from '@renderer/components/Page/Header'
import { ButtonPrimary } from '@renderer/ui-kit/Button'
import { start, stop, getAll, add, Node, Network, Type } from '@renderer/api/node'

export const DraftPage = () => {
  const [nodes, setNodes] = useState<Node[]>([])
  useEffect(() => {
    const getNodes = async () => {
      const nodes = await getAll()
      setNodes(nodes)
    }
    getNodes()
    const interval = setInterval(() => {
      getNodes()
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const onAdd = useCallback(() => {
    const addNode = async () => {
      await add({
        name: 'node2',
        network: Network.testnet8,
        type: Type.local,
        locationDir: '/Users/alex/Downloads/wf-test2'
      })
      const nodes = await getAll()
      setNodes(nodes)
    }
    addNode()
  }, [])

  return (
    <Layout>
      <PageHeader
        title="Draft"
        actions={
          <ButtonPrimary onClick={onAdd}>
            Add <PlusCircleOutlined />
          </ButtonPrimary>
        }
      />
      {nodes.map((node) => (
        <p key={node.id}>
          <pre>{JSON.stringify(node, null, 2)}</pre>
          <>
            <ButtonPrimary onClick={() => start(node.id)}>
              Start <PlayCircleOutlined />
            </ButtonPrimary>
            <ButtonPrimary onClick={() => stop(node.id)}>
              Stop <PauseCircleOutlined />
            </ButtonPrimary>
          </>
        </p>
      ))}
    </Layout>
  )
}

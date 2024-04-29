import { useEffect, useState } from 'react'
import { SearchKeys } from '@renderer/constants/navigation'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getAddWorkerSteps } from '@renderer/helpers/workers'
import { Flex, Layout } from 'antd'
import { PageHeader } from '@renderer/components/Page/Header'
import { ArrowedButton } from '@renderer/ui-kit/Button'
import { PageBody } from '@renderer/components/Page/Body'
import { AddWorker } from '@renderer/containers/Workers/AddWorker'
import { useGetAll, useGetById } from '@renderer/hooks/node'
import { routes } from '@renderer/constants/navigation'
import { addParams } from '@renderer/helpers/navigation'

export const AddWorkerPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const fromNode = searchParams.get(SearchKeys.node)
  const fromStep = searchParams.get(SearchKeys.step)
  const fromMode = searchParams.get(SearchKeys.mode)

  const mode = fromMode === 'import' ? 'import' : 'add'
  const { data } = useGetAll()
  const nodes = mode === 'import' ? data?.filter((node) => node.workersCount === 0) : data
  const { data: node } = useGetById(fromNode || undefined)

  useEffect(() => {
    if (fromNode === null && fromStep === null && nodes && nodes.length > 0) {
      navigate(
        addParams(routes.workers.add, {
          [SearchKeys.node]: nodes[0].id.toString(),
          [SearchKeys.mode]: mode
        })
      )
    }
  }, [fromStep, nodes, fromNode, mode])

  const { steps, stepsWithKeys } = getAddWorkerSteps(node, mode)
  const [step, setStep] = useState<number>(Number(fromStep) || 0)
  const onStepsChange = (value: number) => setStep(value)
  const goNext = () => setStep((prev) => (prev + 1 < steps.length ? prev + 1 : prev))
  const goPrev = () => setStep((prev) => (prev - 1 >= 0 ? prev - 1 : prev))

  return (
    <Layout>
      <PageHeader
        title={mode === 'add' ? 'Add Worker' : 'Import Worker'}
        actions={
          <Flex align="center" gap={4}>
            {step > 0 && <ArrowedButton direction="back" onClick={goPrev} />}
            {step < 3 && <ArrowedButton direction="forward" onClick={goNext} />}
          </Flex>
        }
      />
      <PageBody>
        <AddWorker
          mode={mode}
          step={step}
          steps={steps}
          stepsWithKeys={stepsWithKeys}
          onChangeStep={onStepsChange}
          goNextStep={goNext}
          goPrevStep={goPrev}
          nodes={nodes}
          node={node}
          nodeId={
            fromNode ? fromNode : nodes && nodes.length > 0 ? nodes[0].id.toString() : undefined
          }
        />
      </PageBody>
    </Layout>
  )
}

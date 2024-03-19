import { useState } from 'react'
import { SearchKeys } from '@renderer/constants/navigation'
import { useSearchParams } from 'react-router-dom'
import { getAddWorkerSteps } from '@renderer/helpers/workers'
import { Flex, Layout } from 'antd'
import { PageHeader } from '@renderer/components/Page/Header'
import { ArrowedButton } from '@renderer/ui-kit/Button'
import { PageBody } from '@renderer/components/Page/Body'
import { AddWorker } from '@renderer/containers/Workers/AddWorker'
import { useGetAll, useGetById } from '@renderer/hooks/node'

export const AddWorkerPage = () => {
  const [searchParams] = useSearchParams()
  const fromNode = searchParams.get(SearchKeys.node)

  const { data: nodes } = useGetAll()
  const { data: node } = useGetById(fromNode || undefined)

  const { steps, stepsWithKeys } = getAddWorkerSteps(fromNode)
  const [step, setStep] = useState<number>(0)
  const onStepsChange = (value: number) => setStep(value)
  const goNext = () => setStep((prev) => (prev + 1 < steps.length ? prev + 1 : prev))
  const goPrev = () => setStep((prev) => (prev - 1 >= 0 ? prev - 1 : prev))

  return (
    <Layout>
      <PageHeader
        title="Add Worker"
        actions={
          <Flex align="center" gap={4}>
            {step > 0 && <ArrowedButton direction="back" onClick={goPrev} />}
            {step < 3 && <ArrowedButton direction="forward" onClick={goNext} />}
          </Flex>
        }
      />
      <PageBody>
        <AddWorker
          step={step}
          steps={steps}
          stepsWithKeys={stepsWithKeys}
          onChangeStep={onStepsChange}
          goNextStep={goNext}
          goPrevStep={goPrev}
          nodes={nodes}
          node={node}
        />
      </PageBody>
    </Layout>
  )
}

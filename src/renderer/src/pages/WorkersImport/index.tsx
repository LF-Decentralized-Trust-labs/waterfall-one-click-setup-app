import { useState } from 'react'
import { SearchKeys } from '@renderer/constants/navigation'
import { useSearchParams } from 'react-router-dom'
import { getImportWorkersSteps } from '@renderer/helpers/workers'
import { Flex, Layout } from 'antd'
import { PageHeader } from '@renderer/components/Page/Header'
import { ArrowedButton } from '@renderer/ui-kit/Button'
import { PageBody } from '@renderer/components/Page/Body'
import { ImportWorkers } from '@renderer/containers/Workers/ImportWorkers'

export const ImportWorkerPage = () => {
  const [searchParams] = useSearchParams()
  const fromNode = searchParams.get(SearchKeys.node)

  const { steps, stepsWithKeys } = getImportWorkersSteps(fromNode)
  const [step, setStep] = useState<number>(0)
  const onStepsChange = (value: number) => setStep(value)
  const goNext = () => setStep((prev) => (prev + 1 < steps.length ? prev + 1 : prev))
  const goPrev = () => setStep((prev) => (prev - 1 >= 0 ? prev - 1 : prev))

  return (
    <Layout>
      <PageHeader
        title="Import Worker"
        actions={
          <Flex align="center" gap={4}>
            {step > 0 && <ArrowedButton direction="back" onClick={goPrev} />}
            {step < 3 && <ArrowedButton direction="forward" onClick={goNext} />}
          </Flex>
        }
      />
      <PageBody>
        <ImportWorkers
          step={step}
          steps={steps}
          stepsWithKeys={stepsWithKeys}
          onChangeStep={onStepsChange}
          goNextStep={goNext}
          goPrevStep={goPrev}
        />
      </PageBody>
    </Layout>
  )
}

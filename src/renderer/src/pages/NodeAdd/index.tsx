import { PageBody } from '@renderer/components/Page/Body'
import { PageHeader } from '@renderer/components/Page/Header'
import { CreateNode } from '@renderer/containers/Node/CreateNode'
import { ArrowedButton } from '@renderer/ui-kit/Button'
import { Flex, Layout } from 'antd'
import { useState } from 'react'

export const AddNodePage = () => {
  const [step, setStep] = useState<number>(0)
  const onStepsChange = (value: number) => setStep(value)
  const goNext = () => setStep((prev) => (prev + 1 <= 2 ? prev + 1 : prev))
  const goPrev = () => setStep((prev) => (prev - 1 >= 0 ? prev - 1 : prev))
  return (
    <Layout>
      <PageHeader
        title="Add Node"
        actions={
          <Flex align="center" gap={4}>
            {step > 0 && <ArrowedButton direction="back" onClick={goPrev} />}
            {step < 2 && <ArrowedButton direction="forward" onClick={goNext} />}
          </Flex>
        }
      />
      <PageBody>
        <CreateNode
          step={step}
          onChangeStep={onStepsChange}
          goNextStep={goNext}
          goPrevStep={goPrev}
        />
      </PageBody>
    </Layout>
  )
}

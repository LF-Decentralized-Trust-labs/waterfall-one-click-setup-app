import { Flex } from 'antd'
import { Text } from '@renderer/ui-kit/Typography'
import { styled } from 'styled-components'
import { AddWorkerFields, AddWorkerFormValuesT } from '@renderer/types/workers'
import { Node } from '@renderer/types/node'

export const AddWorkerPreview: React.FC<{
  data: AddWorkerFormValuesT
  node?: Node
}> = ({ data, node }) => {
  return (
    <TabContentWrapper>
      <TextRow label="Node" value={node?.name || data[AddWorkerFields.node]} />
      <TextRow
        label="Mnemonic"
        value={Object.values(data[AddWorkerFields.mnemonicVerify]).join(' ')}
      />
      <TextRow label="Withdrawal Address" value={data[AddWorkerFields.withdrawalAddress]} />
      <TextRow label="Amount" value={data[AddWorkerFields.amount]} />
    </TabContentWrapper>
  )
}

const TabContentWrapper = styled.div`
  //padding: 30px 30px 15px 5px;
  /* border: 1px solid ${({ theme }) => theme.palette.background.gray}; */

  //border-bottom-right-radius: 4px;
  //border-bottom-left-radius: 4px;
`
export const TextRow: React.FC<{ label: string; value?: string | number | React.ReactNode }> = ({
  label,
  value
}) => {
  return (
    <TextItem gap={6} align="center">
      <TextLabel>{label}:</TextLabel>
      <Text>{value}</Text>
    </TextItem>
  )
}

const TextLabel = styled(Text)`
  min-width: 150px;
`

const TextItem = styled(Flex)`
  margin-bottom: 20px;
`

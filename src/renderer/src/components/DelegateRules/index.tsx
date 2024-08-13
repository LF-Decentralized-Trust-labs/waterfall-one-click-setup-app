import React from 'react'
import { styled } from 'styled-components'
import { DelegateRulesT } from '@renderer/types/workers'
import { Text } from '@renderer/ui-kit/Typography'
import { Flex } from 'antd'

type DelegateRulesPropsT = {
  delegateRules?: DelegateRulesT
}

export const DelegateRules: React.FC<DelegateRulesPropsT> = ({ delegateRules }) => {
  if (!delegateRules) {
    return null
  }
  return (
    <Wrapper>
      {delegateRules.trial_period && delegateRules.trial_rules && (
        <>
          <Text>Rules before {delegateRules.trial_period} slots:</Text>
          <TextRow label="Can Withdraw" value={delegateRules.trial_rules.withdrawal.join(', ')} />
          <TextRow
            label="Receives Rewards"
            value={Object.keys(delegateRules.trial_rules.profit_share)
              .map((key) => `${key}: ${delegateRules?.trial_rules?.profit_share[key]}%`)
              .join(', ')}
          />
          <TextRow label="Can Exit" value={delegateRules.trial_rules.exit.join(', ')} />
          <TextRow
            label="Receives Stake"
            value={Object.keys(delegateRules.trial_rules.stake_share)
              .map((key) => `${key}: ${delegateRules?.trial_rules?.stake_share[key]}%`)
              .join(', ')}
          />
        </>
      )}
      {delegateRules.rules && (
        <>
          {delegateRules.trial_period ? (
            <Text>Rules after {delegateRules.trial_period} slots:</Text>
          ) : (
            <Text>Rules:</Text>
          )}

          <TextRow label="Can Withdraw" value={delegateRules.rules.withdrawal.join(', ')} />
          <TextRow
            label="Receives Rewards"
            value={Object.keys(delegateRules.rules.profit_share)
              .map((key) => `${key}: ${delegateRules?.rules?.profit_share[key]}%`)
              .join(', ')}
          />
          <TextRow label="Can Exit" value={delegateRules.rules.exit.join(', ')} />
          <TextRow
            label="Receives Stake"
            value={Object.keys(delegateRules.rules.stake_share)
              .map((key) => `${key}: ${delegateRules?.rules?.stake_share[key]}%`)
              .join(', ')}
          />
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  max-width: 600px;
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

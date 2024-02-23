import React, { useMemo } from 'react'
import { ChartWrapper } from './styles'
import CanvasJSReact from '@canvasjs/react-stockcharts'
import { getValidatorOptions } from '@renderer/helpers/charts'
import { DataPointsStatus } from '@renderer/types/data'
import { Title } from '@renderer/ui-kit/Typography'
import { Flex } from 'antd'

const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart

type PropsT = {
  data: DataPointsStatus
  loading?: boolean
}

export const WorkerStatusChart: React.FC<PropsT> = ({ data }) => {
  const options = useMemo(() => getValidatorOptions(data), [data])
  const containerProps = {
    width: '100%',
    height: '400px',
    margin: 'auto'
  }
  return (
    <ChartWrapper>
      <Title level={5}>
        <Flex gap={10}>This Chart reflects the number and status of Workers</Flex>
      </Title>
      <CanvasJSStockChart containerProps={containerProps} options={options} />
    </ChartWrapper>
  )
}

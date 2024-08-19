import React, { useMemo } from 'react'
import { ChartWrapper } from './styles'
import CanvasJSReact from '@canvasjs/react-stockcharts'
import { getBalanceOptions } from '@renderer/helpers/charts'
import { DataPointsBalance } from '@renderer/types/data'
import { Title } from '@renderer/ui-kit/Typography'

const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart

type PropsT = {
  data: DataPointsBalance
  loading?: boolean
}

export const WorkersBalanceChart: React.FC<PropsT> = ({ data }) => {
  const options = useMemo(() => getBalanceOptions(data), [data])
  const containerProps = {
    width: '100%',
    height: '400px',
    margin: 'auto'
  }
  return (
    <ChartWrapper>
      <Title level={5}>Consult the chart to calculate Validator earnings</Title>
      <CanvasJSStockChart containerProps={containerProps} options={options} />
    </ChartWrapper>
  )
}

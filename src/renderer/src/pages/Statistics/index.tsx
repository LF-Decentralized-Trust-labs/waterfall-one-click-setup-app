import { PageBody } from '@renderer/components/Page/Body'
import { PageHeader } from '@renderer/components/Page/Header'
import { StatisticsCards } from '@renderer/components/Statistics/Cards'
import { RewardsChart } from '@renderer/components/Statistics/Charts/RewardsChart'
import { WorkerEarningChart } from '@renderer/components/Statistics/Charts/WorkerEarningChart'
import { WorkersBalanceChart } from '@renderer/components/Statistics/Charts/WorkersBalanceChart'
import { WorkerStatusChart } from '@renderer/components/Statistics/Charts/WorkersStatusChart'
import { StatisticsEarnedTable } from '@renderer/components/Statistics/EarnedTable'
import { LeaderBoards } from '@renderer/components/Statistics/LeaderBoards'
import { NodeSelector } from '@renderer/components/Statistics/NodeSelector'
import {
  useGetWorkerBalanceData,
  useGetWorkerEarningData,
  useGetWorkerRewardsData,
  useGetWorkerStatusData
} from '@renderer/hooks/statistics'
import { LeaderBoardTableDataTypes } from '@renderer/types/statistics'
import { Text } from '@renderer/ui-kit/Typography'
import { Card, DatePicker, DatePickerProps, Divider, Flex, Layout } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import { useState } from 'react'
const { RangePicker } = DatePicker

const nodeOptions = [
  { label: 'Node 1', value: '1' },
  { label: 'Node 2', value: '2' },
  { label: 'Node 3', value: '3' },
  { label: 'Node 4', value: '4' },
  { label: 'Node 5', value: '5' },
  { label: 'Node 6', value: '6' },
  { label: 'Node 7', value: '7' }
]

const allTimeLeaderBoardsData: LeaderBoardTableDataTypes[] = [
  { key: 1, number: 1, index: 147, balance: 9993.17, rewards: 6793.17 },
  { key: 2, number: 2, index: 664, balance: 9992.44, rewards: 6791.15 },
  { key: 3, number: 3, index: 1313, balance: 9991.33, rewards: 6788.45 },
  { key: 4, number: 4, index: 555, balance: 9991.17, rewards: 6784.22 },
  { key: 5, number: 5, index: 101, balance: 9988.57, rewards: 6782.31 }
]

const epochLeaderBoardsData: LeaderBoardTableDataTypes[] = [
  { key: 1, number: 1, index: 142, balance: 9871.17, rewards: 4.09 },
  { key: 2, number: 2, index: 544, balance: 9054.66, rewards: 4.01 },
  { key: 3, number: 3, index: 1512, balance: 9673.09, rewards: 4.0 },
  { key: 4, number: 4, index: 221, balance: 9601.71, rewards: 3.88 },
  { key: 5, number: 5, index: 312, balance: 9707.37, rewards: 3.28 }
]

export const StatisticsPage = () => {
  const [nodeFilter, setNodeFilter] = useState([nodeOptions[0].value])
  const [_, setDateFilter] = useState<[string, string] | string | null>(null)

  const onNodeSelect = (value?: string[]) => {
    setNodeFilter(value || [])
  }
  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string
  ) => {
    console.log('Selected Time: ', value)
    console.log('Formatted Selected Time: ', dateString)
    setDateFilter(dateString)
  }

  const RewardCards = [
    { title: 'Rewards Per Year', content: '625.00%' },
    { title: 'Rewards Per Day', content: '1.71%' },
    { title: 'Rewards Per Epoch', content: '0.0025%' }
  ]
  const AmountCards = [
    { title: 'Stake amount', content: '10 000' },
    { title: 'Total Balance', content: '20 000' },
    { title: 'Total Rewards', content: '10 000' }
  ]
  const tableData = [{ key: 1, day: 22.124, week: 88.231, month: 320.231, year: 3400.231 }]

  const { data: WEdata } = useGetWorkerEarningData()
  const { data: WSdata } = useGetWorkerStatusData()
  const { data: WBdata } = useGetWorkerBalanceData()
  const { data: WRdata } = useGetWorkerRewardsData()
  return (
    <Layout>
      <PageHeader
        title="Statistics"
        actions={
          <Flex gap={10}>
            <NodeSelector options={nodeOptions} value={nodeFilter} onChange={onNodeSelect} />
            <RangePicker onChange={onChange} />
          </Flex>
        }
      />
      <PageBody>
        <StatisticsCards cards={RewardCards} />
        <Divider />
        <Card title={'Total Workers'} type="inner">
          <Flex justify="center">
            <Text size="lg">300 000</Text>
          </Flex>
        </Card>
        <Divider />
        <StatisticsCards cards={AmountCards} />
        <Divider />
        <StatisticsEarnedTable data={tableData} />
        <Divider />
        <WorkerEarningChart data={WEdata} />
        <Divider />
        <WorkerStatusChart data={WSdata} />
        <Divider />
        <WorkersBalanceChart data={WBdata} />
        <Divider />
        <RewardsChart data={WRdata} />
        <Divider />
        <LeaderBoards
          allTimeData={allTimeLeaderBoardsData}
          singleEpochData={epochLeaderBoardsData}
        />
      </PageBody>
    </Layout>
  )
}

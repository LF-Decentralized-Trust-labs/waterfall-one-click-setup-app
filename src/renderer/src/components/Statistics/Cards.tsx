import { Card, Col, Flex, Row } from 'antd'
import React from 'react'

type PropsT = {
  cards: { title: string | React.ReactNode; content?: string | React.ReactNode }[]
}

export const StatisticsCards: React.FC<PropsT> = ({ cards, ...props }) => {
  return (
    <Row gutter={16} {...props}>
      {cards?.map((el, i) => (
        <Col span={8} key={i}>
          <Card title={<Flex justify="center">{el.title}</Flex>} type="inner">
            <Flex justify="center">{el.content}</Flex>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

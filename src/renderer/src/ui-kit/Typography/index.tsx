import { Typography } from 'antd'
import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { theme } from '../theme'
const { Title, Text: AntdText } = Typography

type TextPropsT = PropsWithChildren & {
  color?: 'black' | 'white'
  size?: 'xsm' | 'sm' | 'md' | 'lg'
}

const Text: React.FC<TextPropsT> = ({ color = 'black', size = 'md', children, ...props }) => {
  return (
    <StyledText color={color} size={size} {...props}>
      {children}
    </StyledText>
  )
}

const colors = {
  black: theme.palette.text.black,
  white: theme.palette.text.white
}
const sizes = {
  xsm: '10px',
  sm: '14px',
  md: '16px',
  lg: '18px'
}

const StyledText = styled(AntdText)<TextPropsT>`
  color: ${({ color }) => colors[color || 'black']};
  font-size: ${({ size }) => sizes[size || 'md']};
`

export { Title, Text }

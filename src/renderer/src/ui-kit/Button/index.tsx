import React from 'react'
import { Button, ButtonProps } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { StyledArrowButton, StyledButton, StyledLink, StyledTextButton } from './styles'
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const IconButton: React.FC<
  {
    shape?: 'circle' | 'default' | 'round' | undefined
    size?: SizeType
    icon: React.ReactNode
    onClick?: () => void
  } & ButtonProps
> = ({ ...props }) => <Button type="primary" shape="circle" size="small" {...props} />

const ArrowedButton: React.FC<{
  onClick?: () => void
  direction: 'forward' | 'back'
}> = ({ onClick, direction = 'forward', ...props }) => (
  <StyledArrowButton
    {...props}
    onClick={onClick}
    icon={direction === 'forward' ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
  />
)

const ButtonPrimary: React.FC<ButtonProps> = ({ children, href, ...props }) => {
  if (href) return <StyledLink to={href}>{children}</StyledLink>

  return (
    <StyledButton type="primary" {...props}>
      {children}
    </StyledButton>
  )
}

const ButtonTextPrimary: React.FC<ButtonProps> = ({ children, ...props }) => (
  <StyledTextButton type="text" {...props}>
    {children}
  </StyledTextButton>
)

export { ButtonPrimary, IconButton, ArrowedButton, Button, ButtonTextPrimary }

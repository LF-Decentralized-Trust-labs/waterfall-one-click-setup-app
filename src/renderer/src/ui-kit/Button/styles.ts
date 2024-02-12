import { styled } from 'styled-components'
import { Button } from 'antd'

export const StyledArrowButton = styled(Button)`
    width: 50px;
    height: 45px;
    margin: 0 5px;
    box-shadow: ${({theme}) => theme.palette.common.black} 3px 2px 4px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid ${({theme}) => theme.palette.common.black};
    border-radius: 0;

`;

export const StyledButton = styled(Button)`
    height: 45px;
    box-shadow: ${({theme}) => theme.palette.common.black} 3px 2px 4px;
    padding: 6px 4px;

    display: flex;
    align-items: center;
    background-color: ${({theme}) => theme.palette.background.lightGray};

    border: 1px solid ${({theme}) => theme.palette.common.black};
    border-radius: 0;

    font-weight: bold;
    font-size: 16px;
`;
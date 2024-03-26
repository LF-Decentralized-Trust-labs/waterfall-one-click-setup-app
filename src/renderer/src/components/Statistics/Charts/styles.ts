import { styled } from 'styled-components'

export const ChartWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 20px 10px;
  h5 {
    color: #fff;
    margin-bottom: 20px;
  }
  .canvasjs-chart-credit {
    display: none;
  }
  max-width: 100%;
  overflow-x: auto;
`

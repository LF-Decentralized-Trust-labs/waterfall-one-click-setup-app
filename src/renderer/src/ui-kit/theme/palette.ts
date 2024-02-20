import { blue } from '@ant-design/colors'

const grayScale = {
  _0: '#ffffff',
  _1: '#fafafa',
  _2: '#f5f5f5',
  _3: '#f0f0f0',
  _4: '#e9e9ec',
  _5: '#bfbfbf',
  _6: '#8c8c8c',
  _7: '#595959',
  _8: '#434343',
  _9: '#262626',
  _10: '#1f1f1f',
  _11: '#141414',
  _12: '#000000'
}

export const palette = {
  layout: {
    white: grayScale._0,
    light: grayScale._1,
    black: grayScale._12
  },
  background: {
    white: grayScale._0,
    lightGray: grayScale._2,
    gray: grayScale._4,
    darkGray: grayScale._6,
    blue: blue.primary,
    black: grayScale._12
  },
  text: {
    white: grayScale._0,
    lightGray: grayScale._2,
    gray: grayScale._5,
    blue: blue.primary,
    black: grayScale._12
  },
  common: {
    white: grayScale._0,
    gray: grayScale._2,
    black: grayScale._12
  }
}

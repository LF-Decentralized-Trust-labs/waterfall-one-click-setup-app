export type DataPointsIncome = {
  maxIncome: { y: number; x: number; toolTipContent: string }[]
  minIncome: { y: number; x: number; toolTipContent: string }[]
  averageIncome: { y: number; x: number; toolTipContent: string }[]
  //epochApr: {y: number; x: number; toolTipContent: string}[];
}

export type DataPointsStatus = {
  pending_activation: { y: number; x: number; toolTipContent: string }[]
  inactive: { y: number; x: number; toolTipContent: string }[]
  active: { y: number; x: number; toolTipContent: string }[]
  pending_deactivation: { y: number; x: number; toolTipContent: string }[]
}

export type DataPointsBalance = {
  balance: { y: number; x: number; toolTipContent: string }[]
  effective_balance: { y: number; x: number; toolTipContent: string }[]
  income: { y: number; x: number; toolTipContent: string }[]
  rewards: { y: number; x: number; toolTipContent: string }[]
  penalty: { y: number; x: number; toolTipContent: string }[]
}
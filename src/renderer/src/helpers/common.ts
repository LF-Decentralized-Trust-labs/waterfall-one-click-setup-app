//eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const isWindows = window?.electron?.platform === 'win'

export const shuffleArray = (array: any[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

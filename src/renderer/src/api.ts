export const start = async (): Promise<void> => {
  const result = await window.api.start()
  console.log(result)
}
export const stop = async (): Promise<void> => {
  const result = await window.api.stop()
  console.log(result)
}

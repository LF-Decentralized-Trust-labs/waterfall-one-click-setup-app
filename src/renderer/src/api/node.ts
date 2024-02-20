export const start = async (): Promise<void> => {
  const result = await window.node.start()
  console.log(result)
}
export const stop = async (): Promise<void> => {
  const result = await window.node.stop()
  console.log(result)
}

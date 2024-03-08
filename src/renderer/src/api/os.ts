export const selectDirectory = async (defaultPath?: string): Promise<string | null> => {
  return await window.os.selectDirectory(defaultPath)
}

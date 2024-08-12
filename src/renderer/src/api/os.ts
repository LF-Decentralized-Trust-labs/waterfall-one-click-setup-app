export const selectDirectory = async (defaultPath?: string): Promise<string | null> => {
  return await window.os.selectDirectory(defaultPath)
}

export const saveTextFile = async (
  text: string,
  title?: string,
  fileName?: string
): Promise<boolean> => {
  return await window.os.saveTextFile(text, title, fileName)
}

export const openExternal = (url: string): void => window.os.openExternal(url)

export const selectFile = async (
  defaultPath?: string,
  filters?: { name: string; extensions: string[] }[]
): Promise<string | null> => {
  return await window.os.selectFile(defaultPath, filters)
}

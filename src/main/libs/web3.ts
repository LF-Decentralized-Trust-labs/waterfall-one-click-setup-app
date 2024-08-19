import * as net from 'node:net'
import Web3 from 'web3'
export const getWeb3 = (provider: string): Web3 => {
  if (provider.includes('.ipc')) {
    // Создайте экземпляр net.Socket
    const socket = new net.Socket()
    return new Web3(new Web3.providers.IpcProvider(provider, socket))
  } else {
    return new Web3(provider)
  }
}

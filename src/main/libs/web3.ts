/*
 * Copyright 2024   Blue Wave Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
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

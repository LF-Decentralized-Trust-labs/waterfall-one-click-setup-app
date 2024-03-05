import log from 'electron-log/node'
import { ethers } from 'ethers'
import { ByteVectorType, ContainerType, UintBigintType } from '@chainsafe/ssz'
// // import { getSecretKeyFromKeystore } from '@myetherwallet/eth2-keystore'
// import { init, SecretKey } from '@chainsafe/bls'
import { deriveChildSKMultiple, deriveMasterSK, pathToIndices } from '@chainsafe/bls-hd-key'
import * as bip39 from 'bip39'

const DOMAIN_DEPOSIT = Buffer.from('03000000', 'hex')
const GENESIS_FORK_VERSION = Buffer.alloc(4)
const AMOUNT = BigInt(3200000000000)
export const genMnemonic = (): string => {
  const entropy = ethers.randomBytes(32)
  const mnemonic = ethers.Mnemonic.fromEntropy(entropy)
  return mnemonic.phrase
}

export const getDepositData = async (
  phrase: string,
  index: number = 0,
  withdrawalAddress: string
) => {

  const seed = bip39.mnemonicToSeedSync(phrase, '')
  log.debug(bytesToHex(seed))
  const masterKey = deriveMasterSK(seed)
  const childKey = deriveChildSKMultiple(masterKey, pathToIndices(`m/12381/3600/${index}/0/0`))
  log.debug(bytesToHex(masterKey))
  //   await init('herumi')
//   const privateKey = SecretKey.fromBytes(childKey)
//   const publicKey = privateKey.toPublicKey().toBytes()
//
//   const hdNodeEth1 = ethers.HDNodeWallet.fromPhrase(phrase, '', `m/44'/60'/0'/0/${index}`)
//   const creatorKey = ethers.getBytes(hdNodeEth1.address)
//
//   const withdrawalKey = ethers.getBytes(withdrawalAddress)
//
//   const domain = compute_deposit_domain(GENESIS_FORK_VERSION)
//   const root = deposit_message_signing_root(publicKey, creatorKey, withdrawalKey)
//   const signingRoot = compute_signing_root(root, domain)
//   const signature = privateKey.sign(signingRoot)
//
//   const deposit_data_root = signed_deposit_root(
//     publicKey,
//     creatorKey,
//     withdrawalKey,
//     AMOUNT,
//     signature.toBytes()
//   )
//   const deposit_message_root2 = deposit_message_root(publicKey, creatorKey, withdrawalKey, AMOUNT)
//
//   return {
//     pubkey: bytesToHex(publicKey),
//     creator_address: bytesToHex(creatorKey),
//     withdrawal_address: bytesToHex(withdrawalKey),
//     amount: ethers.toNumber(AMOUNT),
//     signature: bytesToHex(signature.toBytes()),
//     deposit_message_root: bytesToHex(deposit_message_root2),
//     deposit_data_root: bytesToHex(deposit_data_root),
//     fork_version: bytesToHex(GENESIS_FORK_VERSION),
//     eth2_network_name: 'mainnet',
//     deposit_cli_version: '1.2.0'
//   }
  return {}
}
//
// // {
// //   "pubkey": "8a2cd20834238644f9376951bf827dfed961e3b4dfa84cae226d3ed47a73862692b59f578c3616a38c7ecef1a9a8756b",
// //   "creator_address": "96ed97c554d748e278d7a80809485ad598a915d2",
// //   "withdrawal_address": "30c35895fe0f7768a261b5326e4332cbb4556ba3",
// //   "amount": 3200000000000,
// //   "signature": "83800b479cf76a3cdd71d5e13c6b4bc4df412f14c445cd201c6a737eb03eed46d74649300827f9f79833358761762850027d1da26614c36ea99790bd4149f669ee17cfe0dafcf57073c03c3fab88995a640e568be86c09ce5116a642ee595889",
// //   "deposit_message_root": "e8a5385cd4a364ffc80bc114092c090b499c7e8ba981b60c4e61a6b45f5396cb",
// //   "deposit_data_root": "59d9870de1ec48890ee86efedafa315debe90d0c67a0d39ab351af0a70cce5a8",
// //   "fork_version": "00000000",
// //   "eth2_network_name": "mainnet",
// //   "deposit_cli_version": "1.2.0"
// // },
//
// // {
// //   "pubkey": "865144c3f453813c1145617672b2abf16f0ed1b09365af178b3130819c0e6ad2a98d7c4342b43b2bb0ce61b6badeeae9",
// //   "creator_address": "93d68bb267c936e6eed0aab31ef048c65a1772cc",
// //   "withdrawal_address": "30c35895fe0f7768a261b5326e4332cbb4556ba3",
// //   "amount": 3200000000000,
// //   "signature": "b01a5a7815422dd8c3cd5be159493042d458f1ae6220133d1e339d81143fcbdb02d3b7ed902553ad0e506b1b2dc33c2003da3288afc5aeaf793450a6e804a8378d5f5b58876dc08276706fbb4793df8104b8ffb433021efeed167405175e319d",
// //   "deposit_message_root": "d13df1a45cc2bdba73bea37c62b60f79bbb4755da3a0a336ce0661eff7bfce86",
// //   "deposit_data_root": "43a869415c811197be163be3053301a18d14e6678590208908da5f6e9e30e059",
// //   "fork_version": "00000000",
// //   "eth2_network_name": "mainnet",
// //   "deposit_cli_version": "1.2.0"
// // },
//
//
// // {"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "f9c551dc01912df096ce1c8505bcf75082070f3e73e8a188cd9f8f7f6b9801d2"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "a5cd21dce3d70ff06b96afb42e8c5dc71d9f44a636ca62c8781bef6ebca10f5a"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "14a65ec844380d0528e37992c6d33f36"}, "message": "15be292e670b81a773cca659ea6ad3c01abe246d6bcafd203ea4a285208c7767"}}, "description": "", "pubkey": "8a2cd20834238644f9376951bf827dfed961e3b4dfa84cae226d3ed47a73862692b59f578c3616a38c7ecef1a9a8756b", "path": "m/12381/3600/0/0/0", "uuid": "3730cd39-db91-46f3-8395-bca910d96906", "version": 4}
//
// // const getKeysFormMnemonic2 = async (phrase: string, index: number = 0) => {
// //   const keystore =
// //     '{"crypto": {"kdf": {"function": "scrypt", "params": {"dklen": 32, "n": 262144, "r": 8, "p": 1, "salt": "f9c551dc01912df096ce1c8505bcf75082070f3e73e8a188cd9f8f7f6b9801d2"}, "message": ""}, "checksum": {"function": "sha256", "params": {}, "message": "a5cd21dce3d70ff06b96afb42e8c5dc71d9f44a636ca62c8781bef6ebca10f5a"}, "cipher": {"function": "aes-128-ctr", "params": {"iv": "14a65ec844380d0528e37992c6d33f36"}, "message": "15be292e670b81a773cca659ea6ad3c01abe246d6bcafd203ea4a285208c7767"}}, "description": "", "pubkey": "8a2cd20834238644f9376951bf827dfed961e3b4dfa84cae226d3ed47a73862692b59f578c3616a38c7ecef1a9a8756b", "path": "m/12381/3600/0/0/0", "uuid": "3730cd39-db91-46f3-8395-bca910d96906", "version": 4}\n'
// //   const keystoreObject = JSON.parse(keystore)
// //   const key = await getSecretKeyFromKeystore(keystoreObject, 'COORDINATOR_PASSWORD')
// //   console.log(bytesToHex(key))
// // }
//
function compute_deposit_domain(fork_version: Uint8Array) {
  const fork_data_root = compute_deposit_fork_data_root(fork_version)
  return Uint8Array.from([...DOMAIN_DEPOSIT, ...fork_data_root.slice(0, 28)])
}

function compute_deposit_fork_data_root(current_version: Uint8Array) {
  const genesis_validators_root = Buffer.alloc(32)
  const ForkData = new ContainerType({
    current_version: new ByteVectorType(4),
    genesis_validators_root: new ByteVectorType(32)
  })

  const data = {
    current_version: current_version,
    genesis_validators_root: genesis_validators_root
  }
  return ForkData.hashTreeRoot(data)
}

function compute_signing_root(root: Uint8Array, domain: Uint8Array) {
  const SigningData = new ContainerType({
    object_root: new ByteVectorType(32),
    domain: new ByteVectorType(32)
  })
  const data = {
    object_root: root,
    domain: domain
  }
  return SigningData.hashTreeRoot(data)
}

function deposit_message_signing_root(
  publicKey: Uint8Array,
  creator_address: Uint8Array,
  withdrawal_address: Uint8Array
) {
  const DepositDataType = new ContainerType({
    pubkey: new ByteVectorType(48),
    creator_address: new ByteVectorType(20),
    withdrawal_address: new ByteVectorType(20)
  })

  const data = {
    pubkey: publicKey,
    creator_address: creator_address,
    withdrawal_address: withdrawal_address
  }

  return DepositDataType.hashTreeRoot(data)
}

function deposit_message_root(
  publicKey: Uint8Array,
  creator_address: Uint8Array,
  withdrawal_address: Uint8Array,
  amount: bigint
) {
  const DepositDataType = new ContainerType({
    pubkey: new ByteVectorType(48),
    creator_address: new ByteVectorType(20),
    withdrawal_address: new ByteVectorType(20),
    amount: new UintBigintType(8)
  })

  const data = {
    pubkey: publicKey,
    creator_address: creator_address,
    withdrawal_address: withdrawal_address,
    amount: amount
  }

  return DepositDataType.hashTreeRoot(data)
}

function signed_deposit_root(
  publicKey: Uint8Array,
  creator_address: Uint8Array,
  withdrawal_address: Uint8Array,
  amount: bigint,
  signature: Uint8Array
) {
  const DepositDataType = new ContainerType({
    pubkey: new ByteVectorType(48),
    creator_address: new ByteVectorType(20),
    withdrawal_address: new ByteVectorType(20),
    amount: new UintBigintType(8),
    signature: new ByteVectorType(96)
  })

  const data = {
    pubkey: publicKey,
    creator_address: creator_address,
    withdrawal_address: withdrawal_address,
    amount: amount,
    signature: signature
  }
  return DepositDataType.hashTreeRoot(data)
}

const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'))
function isBytes(a: unknown): a is Uint8Array {
  return (
    a instanceof Uint8Array ||
    (a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array')
  )
}
function bytesToHex(bytes: Uint8Array): string {
  if (!isBytes(bytes)) throw new Error('Uint8Array expected')
  // pre-caching improves the speed 6x
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]]
  }
  return hex
}
//
// // "@chainsafe/bls": "^6.0.3",
// //   "@chainsafe/bls-hd-key": "^0.3.0",
// //
// //   "@myetherwallet/eth2-keystore": "^0.3.1",

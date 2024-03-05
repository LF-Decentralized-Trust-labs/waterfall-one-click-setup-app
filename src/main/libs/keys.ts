// import log from 'electron-log/node'
import { createDecipheriv, pbkdf2Sync } from 'node:crypto'
import { ethers } from 'ethers'
import { ByteVectorType, ContainerType, UintBigintType } from '@chainsafe/ssz'
import { init, SecretKey } from '@chainsafe/bls'
import { deriveChildSKMultiple, deriveMasterSK, pathToIndices } from '@chainsafe/bls-hd-key'
import * as bip39 from 'bip39'
import { scrypt } from 'scrypt-js'

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
  const masterKey = deriveMasterSK(seed)
  const childKey = deriveChildSKMultiple(masterKey, pathToIndices(`m/12381/3600/${index}/0/0`))
  await init('herumi')
  const privateKey = SecretKey.fromBytes(childKey)
  const publicKey = privateKey.toPublicKey().toBytes()

  const hdNodeEth1 = ethers.HDNodeWallet.fromPhrase(phrase, '', `m/44'/60'/0'/0/${index}`)
  const creatorKey = ethers.getBytes(hdNodeEth1.address)

  const withdrawalKey = ethers.getBytes(withdrawalAddress)

  const domain = computeDepositDomain(GENESIS_FORK_VERSION)
  const root = getDepositMessageSigningRoot({ publicKey, creatorKey, withdrawalKey })
  const signingRoot = computeSigningRoot({ root, domain })
  const signature = privateKey.sign(signingRoot)

  const deposit_message_root = getDepositMessageRoot({
    publicKey,
    creatorKey,
    withdrawalKey,
    amount: AMOUNT
  })
  const deposit_data_root = getSignedDepositRoot({
    publicKey,
    creatorKey,
    withdrawalKey,
    amount: AMOUNT,
    signature: signature.toBytes()
  })

  return {
    pubkey: bytesToHex(publicKey),
    creator_address: bytesToHex(creatorKey),
    withdrawal_address: bytesToHex(withdrawalKey),
    amount: ethers.toNumber(AMOUNT),
    signature: bytesToHex(signature.toBytes()),
    deposit_message_root: bytesToHex(deposit_message_root),
    deposit_data_root: bytesToHex(deposit_data_root),
    fork_version: bytesToHex(GENESIS_FORK_VERSION),
    eth2_network_name: 'mainnet',
    deposit_cli_version: '1.2.0'
  }
}

interface KeyStore {
  crypto: Crypto
  description: string
  pubkey: string
  path: string
  uuid: string
  version: number
}

interface Crypto {
  kdf: Kdf
  checksum: Checksum
  cipher: Cipher
}

interface Kdf {
  function: string
  params: KdfParams
  message: string
}

interface KdfParams {
  dklen: number
  n: number
  r: number
  p: number
  c: number
  salt: string
}

interface Checksum {
  function: string
  params: object
  message: string
}

interface Cipher {
  function: string
  params: CipherParams
  message: string
}

interface CipherParams {
  iv: string
}

export const getSecretKeyFromKeystore = async (keystore: KeyStore, password: string) => {
  const derivedKey = await getDerivedKey(keystore, password)
  const checksum = ethers.sha256(
    Uint8Array.from([
      ...derivedKey.slice(16),
      ...ethers.getBytes('0x' + keystore.crypto.cipher.message)
    ])
  )
  if (checksum !== '0x' + keystore.crypto.checksum.message)
    return Promise.reject('invalid password')
  const decipher = createDecipheriv(
    keystore.crypto.cipher.function,
    derivedKey.slice(0, 16),
    ethers.getBytes('0x' + keystore.crypto.cipher.params.iv)
  )

  const decryptedB = Uint8Array.from([
    ...decipher.update(ethers.getBytes('0x' + keystore.crypto.cipher.message)),
    ...decipher.final()
  ])
  return bytesToHex(decryptedB)
}

export const getKeyStore = async (
  phrase: string,
  index: number = 0,
  password: string,
  params = {}
): Promise<KeyStore> => {
  password = normalizePassword(password)

  const path = `m/12381/3600/${index}/0/0`
  const seed = bip39.mnemonicToSeedSync(phrase, '')
  const masterKey = deriveMasterSK(seed)
  const childKey = deriveChildSKMultiple(masterKey, pathToIndices(path))
  await init('herumi')
  const privateKey = SecretKey.fromBytes(childKey)
  const publicKey = privateKey.toPublicKey().toBytes()

  const v4Defaults = {
    cipher: 'aes-128-ctr',
    kdf: 'scrypt',
    salt: ethers.randomBytes(32),
    iv: ethers.randomBytes(16),
    dklen: 32,
    c: 262144,
    n: 262144,
    r: 8,
    p: 1,
    uuid: ethers.randomBytes(16)
  }
  Object.assign(v4Defaults, params)
  let derivedKey, kdfParams
  if (v4Defaults.kdf === KDFFunctions.PBKDF) {
    kdfParams = kdfParamsForPBKDF(v4Defaults)
    derivedKey = pbkdf2Sync(
      ethers.getBytes(password),
      ethers.getBytes(kdfParams.salt),
      kdfParams.c,
      kdfParams.dklen,
      'sha256'
    )
  } else {
    kdfParams = kdfParamsForScrypt(v4Defaults)
    const _derivedKey = await scrypt(
      Buffer.from(password),
      kdfParams.salt,
      kdfParams.n,
      kdfParams.r,
      kdfParams.p,
      kdfParams.dklen
    )
    derivedKey = Buffer.from(_derivedKey)
  }

  const decipher = createDecipheriv(v4Defaults.cipher, derivedKey.slice(0, 16), v4Defaults.iv)
  const decryptedB = Uint8Array.from([
    ...decipher.update(privateKey.toBytes()),
    ...decipher.final()
  ])

  const checksum = ethers.sha256(Uint8Array.from([...derivedKey.slice(16), ...decryptedB]))

  return {
    crypto: {
      kdf: {
        function: v4Defaults.kdf,
        params: {
          ...kdfParams,
          salt: bytesToHex(kdfParams.salt)
        },
        message: ''
      },
      checksum: {
        function: 'sha256',
        params: {},
        message: checksum.replace('0x', '')
      },
      cipher: {
        function: v4Defaults.cipher,
        params: {
          iv: bytesToHex(v4Defaults.iv)
        },
        message: bytesToHex(decryptedB)
      }
    },
    description: '',
    pubkey: bytesToHex(publicKey),
    path: path,
    uuid: ethers.uuidV4(v4Defaults.uuid),
    version: 4
  }
}

const getDerivedKey = async (keystore: KeyStore, password: string) => {
  password = normalizePassword(password)
  let derivedKey: Buffer = Buffer.alloc(0)
  if (keystore.crypto.kdf.function === KDFFunctions.Scrypt) {
    const kdfparams = keystore.crypto.kdf.params
    const _derivedKey = await scrypt(
      Buffer.from(password),
      Buffer.from(kdfparams.salt, 'hex'),
      kdfparams.n,
      kdfparams.r,
      kdfparams.p,
      kdfparams.dklen
    )
    derivedKey = Buffer.from(_derivedKey)
  } else if (keystore.crypto.kdf.function === KDFFunctions.PBKDF) {
    const kdfparams = keystore.crypto.kdf.params
    derivedKey = pbkdf2Sync(
      ethers.getBytes(password),
      ethers.getBytes(kdfparams.salt),
      kdfparams.c,
      kdfparams.dklen,
      'sha256'
    )
  }
  return derivedKey
}

function computeDepositDomain(fork_version: Uint8Array) {
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

function computeSigningRoot(data: { root: Uint8Array; domain: Uint8Array }) {
  const SigningData = new ContainerType({
    root: new ByteVectorType(32),
    domain: new ByteVectorType(32)
  })
  return SigningData.hashTreeRoot(data)
}

function getDepositMessageSigningRoot(data: {
  publicKey: Uint8Array
  creatorKey: Uint8Array
  withdrawalKey: Uint8Array
}) {
  const DepositDataType = new ContainerType({
    publicKey: new ByteVectorType(48),
    creatorKey: new ByteVectorType(20),
    withdrawalKey: new ByteVectorType(20)
  })

  return DepositDataType.hashTreeRoot(data)
}

function getDepositMessageRoot(data: {
  publicKey: Uint8Array
  creatorKey: Uint8Array
  withdrawalKey: Uint8Array
  amount: bigint
}) {
  const DepositDataType = new ContainerType({
    publicKey: new ByteVectorType(48),
    creatorKey: new ByteVectorType(20),
    withdrawalKey: new ByteVectorType(20),
    amount: new UintBigintType(8)
  })

  return DepositDataType.hashTreeRoot(data)
}

function getSignedDepositRoot(data: {
  publicKey: Uint8Array
  creatorKey: Uint8Array
  withdrawalKey: Uint8Array
  amount: bigint
  signature: Uint8Array
}) {
  const DepositDataType = new ContainerType({
    publicKey: new ByteVectorType(48),
    creatorKey: new ByteVectorType(20),
    withdrawalKey: new ByteVectorType(20),
    amount: new UintBigintType(8),
    signature: new ByteVectorType(96)
  })

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

const KDFFunctions = {
  PBKDF: 'pbkdf2',
  Scrypt: 'scrypt'
}

const kdfParamsForPBKDF = (opts) => {
  return {
    dklen: opts.dklen,
    salt: opts.salt,
    c: opts.c,
    prf: 'hmac-sha256'
  }
}
const kdfParamsForScrypt = (opts) => {
  return {
    dklen: opts.dklen,
    salt: opts.salt,
    n: opts.n,
    r: opts.r,
    p: opts.p
  }
}
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
const normalizePassword = (password: string) => {
  password = password.normalize('NFKD')
  for (let i = 0x00; i < 0x20; i++)
    password = password.replace(new RegExp(escapeRegExp(String.fromCharCode(i)), 'g'), '')
  for (let i = 0x7f; i < 0xa0; i++)
    password = password.replace(new RegExp(escapeRegExp(String.fromCharCode(i)), 'g'), '')
  return password
}

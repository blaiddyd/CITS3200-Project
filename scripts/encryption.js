/**
 * Generate encryption key pair
 */

const NodeRSA = require('node-rsa')
const config = require('../config')
const fs = require('fs')
const path = require('path')

console.log('Generating encryption key pair')

const key = new NodeRSA({ b: 2048 })
const publicKey = key.exportKey('public')
const privateKey = key.exportKey('private')
console.log('2048 RSA key generated')

const { publicKeyPath, privateKeyPath } = config.crypto

const publicFolder = path.dirname(publicKeyPath)
const privateFolder = path.dirname(privateKeyPath)
if (!fs.existsSync(publicFolder))
  fs.mkdirSync(publicFolder, { recursive: true })
if (!fs.existsSync(privateFolder))
  fs.mkdirSync(privateFolder, { recursive: true })
console.log('Crypto folder created')

fs.writeFileSync(publicKeyPath, publicKey)
console.log('Public key written to', publicKeyPath)
fs.writeFileSync(privateKeyPath, privateKey)
console.log('Private key written to', privateKeyPath)

console.log('Done')

const NodeRSA = require('node-rsa')
const config = require('../config')
const fs = require('fs')

/**
 * @function decrypt
 * @description this function decrypts a data object with a pregenerated private key\n
 * N.B: THIS FUNCTION SHOULD NOT BE USED CLIENTSIDE, ONLY SERVERSIDE.
 * @param {string} encryptedData the encrypted string data you wish to decrypt
 */
const decrypt = encryptedData => {
  // Read the private key from the project private key path
  const privateKey = fs.readFileSync(config.crypto.privateKeyPath)

  // Create a new JSEncrypt object
  const rsaPri = new NodeRSA(privateKey)

  // Decrypts the data and returns it
  const decryptedData = rsaPri.decrypt(encryptedData, 'utf8')

  // Convert the payload into an object
  const dataObject = JSON.parse(decryptedData)

  return dataObject
}

module.exports = decrypt

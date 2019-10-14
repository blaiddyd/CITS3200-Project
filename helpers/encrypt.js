const NodeRSA = require('node-rsa')
const config = require('../config')
const fs = require('fs')

/**
 * @function encrypt
 * @description this function encrypts a data object with a pregenerated public key
 * @param {*} dataObject the data you wish to encrypt
 */
const encrypt = dataObject => {
  // Read the public key from the project public key path
  const publicKey = fs.readFileSync(config.crypto.publicKeyPath)

  // Convert the payload into a json string
  const dataAsString = JSON.stringify(dataObject)

  // Create a new NodeRSA object
  const rsaPub = new NodeRSA(publicKey)

  // Encrypts the data and returns it
  const encryptedData = rsaPub.encrypt(dataAsString, 'base64')

  return encryptedData
}

module.exports = encrypt

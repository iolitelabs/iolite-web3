const Accounts = require('web3-eth-accounts')
const Web3 = require('web3')

function isNot (value) {
  return (value === void 0 || value === null)
}

Accounts.prototype.signEthereumTransaction = Accounts.prototype.signTransaction

Accounts.prototype.signIoliteTransaction = function (tx, privateKey, callback) {
  const self = this
  callback = callback || function () { }

  function signed (tx) {
    if (!tx.gas && !tx.gasLimit) {
      throw new Error('"gas" is missing')
    }

    // TODO: chainId
    const result = self._provider.methods.signRawTransaction(tx, privateKey)

    callback(null, result)
    return result
  }

  // Returns synchronously if nonce, chainId and price are provided
  if (tx.nonce && tx.chainId && tx.gasPrice) {
    return Promise.resolve(signed(tx))
  }

  // Otherwise, get the missing info from the Ethereum Node
  return Promise.all([
    isNot(tx.chainId) ? self._ethereumCall.getId() : tx.chainId,
    isNot(tx.gasPrice) ? self._ethereumCall.getGasPrice() : tx.gasPrice,
    isNot(tx.nonce) ? self._ethereumCall.getTransactionCount(self.privateKeyToAccount(privateKey).address) : tx.nonce
  ]).then(function (args) {
    if (isNot(args[0]) || isNot(args[1]) || isNot(args[2])) {
      throw new Error('One of the values "chainId", "gasPrice", or "nonce" couldn\'t be fetched: ' + JSON.stringify(args))
    }
    return signed(Object.assign(tx, { chainId: args[0], gasPrice: args[1], nonce: args[2] }))
  })
}

Accounts.prototype.signTransaction = function signTransaction () {
  if (this._provider && this._provider.methods && this._provider.methods.signRawTransaction) {
    return this.signIoliteTransaction(...arguments)
  }
  return this.signEthereumTransaction(...arguments)
}

module.exports = Web3

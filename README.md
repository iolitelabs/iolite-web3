## iolite-web3

This is a wrapper over the original [web3.js](https://github.com/ethereum/web3.js) library. Use it with [iolite-provider](https://github.com/iolitelabs/iolite-provider) to be able to use extra fields of iOlite.

## Install

```
npm install --save iolite-web3
```

## Usage

```js
const Web3 = require('iolite-web3')
const IoliteProvider = require('iolite-provider')

const provider = new IoliteProvider('https://sia.node.iolite.io')
const web3 = new Web3(provider)
});
```
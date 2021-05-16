#!/usr/bin/env node

require('ts-node/register/transpile-only')
const { main } = require('../src')
const { resolve } = require('path')

main(process.argv.slice(2)).catch((e) => {
  throw e
})

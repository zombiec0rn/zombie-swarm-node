#!/usr/bin/env node
import minimist from 'minimist'
import mdns     from './mdns'
import http     from './http_api'

let args = minimist(process.argv.slice(2), {
  default: {
    'api-port': 8901
  }
})

// TODO: Validate

let _mdns = mdns(args)
let _http = http(args)

console.log(`
ZombieSwarm started!
  mdns-discovery:
    - address: ${_mdns.address}
  http-api:
    - host: ${_http.host}
    - port: ${args['api-port']}
`)

_http.server.on('listening', () => {
  console.log('Ready...')
})

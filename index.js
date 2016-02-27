#!/usr/bin/env node
import minimist from 'minimist'
import chalk    from 'chalk'
import rainbow  from 'ansi-rainbow'
import emoji    from 'random-emoji'
import address  from 'network-address'
import os       from 'os'
import mdns     from './mdns'
import http     from './http_api'

let args = minimist(process.argv.slice(2), {
  default: {
    'api-port': 8901,
    tag       : [],
    engine    : [],
    swarm     : 'anklebiters',
    hostname  : os.hostname()
  }
})
if (typeof args.tag == 'string') args.tag = [args.tag]
if (typeof args.engine == 'string') args.engine = [args.engine]
args.address = args.address || address(args.interface)

let _mdns = mdns(args)
let _http = http(args)
let engines = args.engine.map(e => {
  if (e.indexOf('docker') >= 0) {
    let port = e.split(':')
    port = (port.length > 1) ? port[1] : '4243'
    return `docker::tcp://${args.address}:${port}`
  }
  return e
})

console.log(`${rainbow.r("Zombie Swarm Node!")}

  ${chalk.green("mdns-discovery:")}
    - address: ${chalk.bold(_mdns.address)}
    - name: ${chalk.bold(args.hostname)}.${chalk.bold(args.swarm)}
  ${chalk.cyan("http-api:")}
    - host: ${chalk.bold(_http.host)}
    - port: ${chalk.bold(args['api-port'])}
    - meta:
      - tags: ${args.tag}
      - engines: ${engines}
`)

_http.server.on('listening', () => {
  let emojiline = emoji.random({ count: 3 }).map(e => e.character).join(' - ')
  console.log(emojiline)
})

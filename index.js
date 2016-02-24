#!/usr/bin/env node
import minimist from 'minimist'
import chalk    from 'chalk'
import rainbow  from 'ansi-rainbow'
import emoji    from 'random-emoji'
import mdns     from './mdns'
import http     from './http_api'

let args = minimist(process.argv.slice(2), {
  default: {
    'api-port': 8901,
    tag : []
  }
})
if (typeof args.tag == 'string') args.tag = [args.tag]

// TODO: Validate

let _mdns = mdns(args)
let _http = http(args)

console.log(`${rainbow.r("Zombie Swarm Node!")}

  ${chalk.green("mdns-discovery:")}
    - address: ${chalk.bold(_mdns.address)}
  ${chalk.cyan("http-api:")}
    - host: ${chalk.bold(_http.host)}
    - port: ${chalk.bold(args['api-port'])}
`)

_http.server.on('listening', () => {
  let emojiline = emoji.random({ count: 3 }).map(e => e.character).join(' - ')
  console.log(emojiline)
})

#!/usr/bin/env node
import minimist from 'minimist'
import chalk    from 'chalk'
import rainbow  from 'ansi-rainbow'
import address  from 'network-address'
import os       from 'os'
import mdns     from './mdns'
import http     from './api'
import pkg      from './package.json'

let args = minimist(process.argv.slice(2), {
  default: {
    'api-port': 8901,
    tag       : [],
    engine    : [],
    swarm     : 'anklebiters',
    hostname  : os.hostname()
  }
})
if (args.v || args.version) {
  console.log(pkg.version)
  process.exit(0)
}
if (args.h || args.help) {
  console.log(`zombie-swarm-node [OPTIONS]

OPTIONS

interface   - The network interface to broadcast and bind to
tag         - Add node tags
engine      - Add a node engine 
swarm       - Set the node swarm  (default anklebiters)
hostname    - Node hostname       (default os.hostname())
api-port    - The http api port   (default 8901)
version     - Display version
help        - Display help
`)
  process.exit(0)
}
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

console.log(`${rainbow.r('Zombie Swarm Node!')} 

             ${chalk.red('/')}
         ,._/
        (((${chalk.green('@')}\\
   _,---) )r'
  (//// \\\\\\
  ) \\\\\\  |\\\\
    '''  '''

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
  console.log(`API @ http://${_http.host}:${args['api-port']}`)
})

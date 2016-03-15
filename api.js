import os from 'os'
import http from 'http'

function requestHandler(args, sq) {
  return function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      tags: args.tag,
      engines: args.engine,
      swarm: args.swarm,
      hostname: args.hostname,
      memory: os.totalmem(),
      cpus: os.cpus(),
      services: sq.services
    }));
  }
}

export default function(args, sq) {
  let server = http.createServer(requestHandler(args, sq))
  server.listen(args['api-port'], args.address) 
  return {
    server : server,
    host   : args.address
  }
}

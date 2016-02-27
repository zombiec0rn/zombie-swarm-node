import http from 'http'

function requestHandler(args) {
  return function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      tags: args.tag,
      engines: args.engine,
      swarm: args.swarm,
      hostname: args.hostname
    }));
  }
}

export default function(args) {
  let server = http.createServer(requestHandler(args))
  server.listen(args['api-port'], args.address) 
  return {
    server : server,
    host   : args.address
  }
}

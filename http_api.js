import http    from 'http'
import address from 'network-address'

function requestHandler(args) {
  return function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      tags: args.tag,
      engines: args.engine
    }));
  }
}

export default function(args) {
  let server = http.createServer(requestHandler(args))
  let host   = args['api-host'] || address(args.interface)
  server.listen(args['api-port'], host) 
  return {
    server : server,
    host   : host
  }
}

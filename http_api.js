import http    from 'http'
import address from 'network-address'

function requestHandler(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
}

export default function(args) {
  let server = http.createServer(requestHandler)
  let host   = args['api-host'] || address(args.interface)
  server.listen(args['api-port'], host) 
  return {
    server : server,
    host   : host
  }
}

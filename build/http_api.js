'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (args) {
  var server = _http2.default.createServer(requestHandler(args));
  server.listen(args['api-port'], args.address);
  return {
    server: server,
    host: args.address
  };
};

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function requestHandler(args) {
  return function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      tags: args.tag,
      engines: args.engine,
      swarm: args.swarm
    }));
  };
}
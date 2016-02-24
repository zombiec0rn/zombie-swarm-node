'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (args) {
  var server = _http2.default.createServer(requestHandler(args));
  var host = args['api-host'] || (0, _networkAddress2.default)(args.interface);
  server.listen(args['api-port'], host);
  return {
    server: server,
    host: host
  };
};

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _networkAddress = require('network-address');

var _networkAddress2 = _interopRequireDefault(_networkAddress);

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
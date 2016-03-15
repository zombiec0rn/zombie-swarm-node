#!/usr/bin/env node
'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ansiRainbow = require('ansi-rainbow');

var _ansiRainbow2 = _interopRequireDefault(_ansiRainbow);

var _networkAddress = require('network-address');

var _networkAddress2 = _interopRequireDefault(_networkAddress);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _mdns2 = require('./mdns');

var _mdns3 = _interopRequireDefault(_mdns2);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _serviceQuery = require('./serviceQuery');

var _serviceQuery2 = _interopRequireDefault(_serviceQuery);

var _package = require('./package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2), {
  default: {
    'api-port': 8901,
    tag: [],
    engine: [],
    swarm: 'anklebiters',
    hostname: _os2.default.hostname()
  }
});
if (args.v || args.version) {
  console.log(_package2.default.version);
  process.exit(0);
}
if (args.h || args.help) {
  console.log('zombie-swarm-node [OPTIONS]\n\nOPTIONS\n\ninterface   - The network interface to broadcast and bind to\ntag         - Add node tags\nengine      - Add a node engine \nswarm       - Set the node swarm  (default anklebiters)\nhostname    - Node hostname       (default os.hostname())\napi-port    - The http api port   (default 8901)\nversion     - Display version\nhelp        - Display help\n');
  process.exit(0);
}
if (typeof args.tag == 'string') args.tag = [args.tag];
if (typeof args.engine == 'string') args.engine = [args.engine];
args.address = args.address || (0, _networkAddress2.default)(args.interface);
var engines = args.engine.map(function (e) {
  if (e.indexOf('docker') >= 0) {
    var port = e.split(':');
    port = port.length > 1 ? port[1] : '4243';
    return 'docker::tcp://' + args.address + ':' + port;
  }
  return e;
});

var _mdns = (0, _mdns3.default)(args);
var _sq = (0, _serviceQuery2.default)(args, engines);
var _http = (0, _api2.default)(args, _sq);
_sq.start();

console.log(_ansiRainbow2.default.r('Zombie Swarm Node!') + ' \n\n             ' + _chalk2.default.red('/') + '\n         ,._/\n        (((' + _chalk2.default.green('@') + '\\\n   _,---) )r\'\n  (//// \\\\\\\n  ) \\\\\\  |\\\\\n    \'\'\'  \'\'\'\n\n  ' + _chalk2.default.green("mdns-discovery:") + '\n    - address: ' + _chalk2.default.bold(_mdns.address) + '\n    - name: ' + _chalk2.default.bold(args.hostname) + '.' + _chalk2.default.bold(args.swarm) + '\n  ' + _chalk2.default.cyan("http-api:") + '\n    - host: ' + _chalk2.default.bold(_http.host) + '\n    - port: ' + _chalk2.default.bold(args['api-port']) + '\n    - meta:\n      - tags: ' + args.tag + '\n      - engines: ' + engines + '\n');

_http.server.on('listening', function () {
  console.log('API @ http://' + _http.host + ':' + args['api-port']);
});
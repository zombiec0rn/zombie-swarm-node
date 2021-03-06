'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (args) {
  var mdns = (0, _multicastDns2.default)({
    interface: args.address
  });
  mdns.on('query', function (q) {
    if (args['debug-mdns']) console.log('MDNS QUERY', q);
    var swarmQuery = q.questions.reduce(function (found, question) {
      if (question.name == 'zombie-swarm') found = question;
      return found;
    }, null);
    if (!swarmQuery) return;
    mdns.respond([{
      name: args.hostname + '.' + args.swarm + '.zombie-swarm',
      type: 'A',
      ttl: 120,
      data: args.address
    }]);
  });
  return {
    address: args.address
  };
};

var _multicastDns = require('multicast-dns');

var _multicastDns2 = _interopRequireDefault(_multicastDns);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
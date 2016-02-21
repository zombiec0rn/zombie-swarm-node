#!/usr/bin/env node
'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _multicastDns = require('multicast-dns');

var _multicastDns2 = _interopRequireDefault(_multicastDns);

var _networkAddress = require('network-address');

var _networkAddress2 = _interopRequireDefault(_networkAddress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));
var address = (0, _networkAddress2.default)(args.interface);
var mdns = (0, _multicastDns2.default)();
mdns.on('query', function (q) {
    var swarmQuery = q.questions.reduce(function (found, question) {
        if (question.name == 'zombie-swarm') found = question;
        return found;
    }, null);
    if (!swarmQuery) return;
    mdns.respond([{
        name: 'zombie-swarm',
        type: 'A',
        ttl: 120,
        data: address
    }, {
        name: 'docker-engine',
        type: 'SRV',
        ttl: 120,
        data: {
            port: 4243,
            weight: 0,
            priority: 10,
            target: address
        }
    }]);
});


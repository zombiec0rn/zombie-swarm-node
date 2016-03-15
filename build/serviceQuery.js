'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = makeServiceQuery;

var _dockerInspector = require('docker-inspector');

var _dockerInspector2 = _interopRequireDefault(_dockerInspector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function makeServiceQuery(args, engines) {
  return new ServiceQuery(args, engines);
}

var ServiceQuery = function () {
  function ServiceQuery(args, engines) {
    _classCallCheck(this, ServiceQuery);

    this.args = args;
    this.engines = engines;
    this.services = [];
  }

  _createClass(ServiceQuery, [{
    key: 'start',
    value: function start() {
      this.interval = setInterval(this.queryServices.bind(this), 5000);
      this.queryServices();
    }
  }, {
    key: 'stop',
    value: function stop() {
      clearInterval(this.interval);
    }
  }, {
    key: 'queryServices',
    value: function queryServices() {
      var _this = this;

      if (this.querying) return;
      this.querying = true;
      var docker_hosts = this.engines.map(function (engine) {
        var e = engine.split('::');
        if (e[0] == 'docker') {
          var host = e[1].split('//')[1];
          var hostport = host.split(':');
          return { host: hostport[0], port: hostport[1] };
        }
      }).filter(function (e) {
        return e != undefined;
      });
      (0, _dockerInspector2.default)({ hosts: docker_hosts }).inspect(function (err, containers) {
        if (err) {
          console.error(err);
          _this.querying = false;
          return;
        }
        var _containers = containers.map(function (container) {
          return {
            id: container.Name.slice(1),
            image: container.Config.Image,
            cmd: (container.Config.Cmd || []).join(' '),
            ports: Object.keys(container.HostConfig.PortBindings || {}).map(function (c_port) {
              var p_data = container.HostConfig.PortBindings[c_port];
              var h_port = p_data ? p_data[0].HostPort : c_port.split('/')[0];
              return h_port + ':' + c_port;
            }),
            env: container.Config.Env,
            volumes: Object.keys(container.Volumes || {}).map(function (to) {
              return container.Volumes[to] + ':' + to;
            })
          };
        });
        _this.services = _containers;
        _this.querying = false;
      });
    }
  }]);

  return ServiceQuery;
}();
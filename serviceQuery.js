import inspector from 'docker-inspector'

export default function makeServiceQuery(args, engines) {
  return new ServiceQuery(args, engines)
}

class ServiceQuery {
  constructor(args, engines) {
    this.args = args
    this.engines = engines
    this.services = []
  }
  start() {
    this.interval = setInterval(this.queryServices.bind(this), 5000)
    this.queryServices()
  }
  stop() {
    clearInterval(this.interval)
  }
  queryServices() {
    if (this.querying) return
    this.querying = true
    let docker_hosts = this.engines.map(engine => {
      let e = engine.split('::')
      if (e[0] == 'docker') {
        let host = e[1].split('//')[1]
        let hostport = host.split(':')
        return { host: hostport[0], port: hostport[1] }
      }
    }).filter(e => e != undefined)
    inspector({hosts:docker_hosts}).inspect((err, containers) => {
      if (err) {
        console.error(err)
        this.querying = false
        return
      }
      var _containers = containers.map((container) => {
        return {
          id      : container.Name.slice(1),
          image   : container.Config.Image,
          cmd     : (container.Config.Cmd || []).join(' '),
          ports   : Object.keys(container.HostConfig.PortBindings || {}).map(function(c_port) {
            var p_data = container.HostConfig.PortBindings[c_port]
            var h_port = p_data ? p_data[0].HostPort : c_port.split('/')[0]
            return h_port+':'+c_port
          }),
          env     : container.Config.Env,
          volumes : Object.keys(container.Volumes || {}).map(function(to) {
              return container.Volumes[to]+':'+to
          })
          }
        })
        this.services = _containers
        this.querying = false
    })

  }
}

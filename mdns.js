import _mdns    from 'multicast-dns'
import _address from 'network-address'

export default function(args) {
  let address = _address(args.interface)
  let mdns = _mdns()
  mdns.on('query', q => {
    let swarmQuery = q.questions.reduce((found, question) => {
      if (question.name == 'zombie-swarm') found = question
      return found
    }, null)
    if (!swarmQuery) return
    mdns.respond([
      {
        name : 'zombie-swarm',
        type : 'A',
        ttl  : 120,
        data : address 
      }
    ])
  })
  return {
    address : address
  }
}

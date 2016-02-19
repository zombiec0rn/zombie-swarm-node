import _mdns    from 'multicast-dns'
import _address from './network-address'

let address = _address('zt2')
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
        },
        {
            name : 'docker-engine',
            type : 'SRV',
            ttl  : 120,
            data : {
                port     : 4243,
                weight   : 0,
                priority : 10,
                target   : address
            }
        }
    ])
})

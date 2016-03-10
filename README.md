# Zombie Swarm Node

A [zombie-swarm]() node.

A zombie-swarm node broadcasts it's ip via [multicast-dns](https://en.wikipedia.org/wiki/Multicast_DNS). It also offers up a http api with more information about itself.

## Install

```sh
npm install -g @zombiec0rn/zombie-swarm-node
```

## Use

```sh
zombie-swarm-node --interface eth0 --swarm lurkers --tag gateway --engine docker:4243
curl (network-address eth0):8901 | prettyjson
//  tags: 
//    - gateway
//  engines: 
//    - docker:4243
//  swarm:    lurkers
//  hostname: clutterbits
//  memory:   8240132096
//  cpus: ... 
```

## Options

```
interface   - The network interface to broadcast and bind to
tag         - Add node tags
engine      - Add a node engine 
swarm       - Set the node swarm  (default anklebiters)
hostname    - Node hostname       (default os.hostname())
api-port    - The http api port   (default 8901)
```

## Changelog

### 1.0.0

* Initial release :tada:

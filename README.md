
# ipfs-messenger

> 1-1 messaging for ipfs nodes. Emits connection events, listening for messages, send messages to nodes. Best suited for server-to-server messaging.

## Install
```
npm install @0xvaibhav/ipfs-messenger
```
## Use
Initializing and starting the messenger.
```js
import * as IPFS from "ipfs-core";
import Messenger from "@0xvaibhav/ipfs-messenger";
const ipfs = await IPFS.create();
const messenger = new Messenger(ipfs, {});
await messenger.start();
```
Listen for events emitted when starting messenger.
```js
messenger.on("start", (m) => {
    console.log(m.message)
})
```
Once messenger has been started, listen to incoming messages.
```js
messenger.on("message", (m) => {
    console.log(m.data)
});
```
Make sure to establish connection with other node before sending any message and only on establishment of connection, proceed to send any message.
```js
messenger.on("connected", (d) => {
    console.log(`Connected to ${d.address}`)
    messenger.send("to-address", "Any Message (Objects should be stringyfied)")
})
messenger.connect("ipfs-address")
```
Close connection and stop listening for messages.
```js
messenger.on("disconnected", (d) => {
    console.log(`Disconnected from ${d.address}`)
})
messenger.on("stop", () => {
    console.log("Stopped listening to any incoming messages")
})
messenger.disconnect("ipfs-address")
messenger.stop()
```
#### Find more in the `examples` directory.

## API
### new Messenger(ipfs, {options})
* `ipfs` : IPFS Node, Must have pubsub activated.
```js
    const messenger = new Messenger(ipfs, {})
```
### messenger.start()
Starts the messenger
### messenger.stop()
Stops the messenger
### messenger.connect(ipfsAddr: string)
* `ipfsAddr`: string, Address of IPFS node to connect with.
Establish connection to IPFS node. Required before sending any message.
### messenger.disconnect(ipfsAddr)
Terminate the connection established with an IPFS node.
### messenger.send(ipfsAddr: string, message: string)
* `message`: string, Data to be sent across.
Send message to the IPFS node with which connection has already been established.
### messenger.events.on("start", ({message}) => console.log(message))
Once the messenger has been started.
### messenger.events.on("stop", ({message}) => console.log(message))
Once the messenger has been stopped.
### messenger.events.on("connected", ({address}) => console.log(address))
When connected with an IPFS node.
### messenger.events.on("disconnected", ({address}) => console.log(address))
When disconnect with an IPFS node.
### messenger.events.on("message", ({data}) => console.log(data))
When a message is received.
### messenger.events.on("sent", ({data}) => console.log(data))
Once a message has been successfully sent.

## Contribute
Feel free to join in. All welcome. Open an [issue](https://github.com/vaibhavmuchandi/ipfs-messenger/issues)!
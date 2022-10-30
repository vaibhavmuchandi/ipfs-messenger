import { EventEmitter } from "events";
import {
  createChannel,
  removeChannel,
  sendMessage,
  decodeMessage,
} from "./utils/utils.js";

import { ipv4 } from "getipify";
class Messenger {
  constructor(ipfs, options) {
    this.events = new EventEmitter();
    this._ipfs = ipfs;
    this._options = options;
    this._channels = [];
    this._identity = null;
    this._address = "";
    this._getAddress();
  }

  get ipfs() {
    return this._ipfs;
  }

  get options() {
    return this._options;
  }

  get channels() {
    return this._channels;
  }

  get identity() {
    return this._identity;
  }

  _getAddress = async () => {
    const ip4 = await ipv4();
    const ipfsInternal = await this._ipfs.id();
    const address = ipfsInternal.addresses[0].toString().split("/");
    address[2] = ip4;
    const externalAddress = address.join("/");
    this._address = externalAddress;
    console.log("Swarm listening on ", this._address);
  };

  _receivedMessage = async (message) => {
    const decodedMessage = await decodeMessage(message.data);
    this.events.emit("message", { data: decodedMessage });
  };

  start = async () => {
    const identity = await this._ipfs.id();
    this._identity = identity;
    await this._ipfs.pubsub.subscribe(
      identity.addresses[0].toString(),
      this._receivedMessage
    );
    this.events.emit("start", {
      message: `Listening for messages on ${identity.addresses[0].toString()}\nListening for messages on ${
        this._address
      }`,
    });
  };

  stop = async () => {
    await this._ipfs.pubsub.unsubscribe(
      this._identity.addresses[0].toString(),
      this._receivedMessage
    );
    this.events.emit("stop", { message: `No more listening for messages.` });
  };

  connect = async (ipfsToConnect) => {
    if (typeof ipfsToConnect !== "string")
      throw new Error("IPFS Address to connect with should be string.");
    const isConnected = await createChannel(this._ipfs, ipfsToConnect);
    if (isConnected) {
      this._channels.push(ipfsToConnect);
      this.events.emit("connected", { address: ipfsToConnect });
    }
  };

  disconnect = async (ipfsToDisconnect) => {
    if (typeof ipfsToDisconnect !== "string")
      throw new Error("IPFS Address to disconnect with should be string.");
    if (!this._channels.includes(ipfsToDisconnect))
      throw new Error("No connection found with this address.");
    const isDisconnected = await removeChannel(this._ipfs, ipfsToDisconnect);
    if (isDisconnected) {
      this._channels = this._channels.filter((c) => c !== ipfsToDisconnect);
      this.events.emit("disconnected", { address: ipfsToDisconnect });
    }
  };

  send = async (toAddress, message) => {
    await sendMessage(this._ipfs, toAddress, message);
    this.events.emit("sent", true);
  };
}

export default Messenger;

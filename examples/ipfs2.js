import * as IPFS from "ipfs-core";
import config from "./ipfs-conf.js";
import Messenger from "../index.js";

const toAddress =
  "/ip4/127.0.0.1/tcp/45877/p2p/12D3KooWM6wvkJvmQJRJxJwcra78vcAqX32jWSKPqjH1y7QsQ7VW";
(async () => {
  const ipfs = await IPFS.create(config.config2);
  const messenger = new Messenger(ipfs, {});
  messenger.events.on("start", (d) => {
    console.log(d.message);
  });
  messenger.events.on("stop", (d) => {
    console.log(d.message);
  });
  messenger.events.on("sent", (d) => {
    console.log(d);
  });
  messenger.events.on("connected", (m) => {
    console.log(`Connected to ${m.address}`);
    setTimeout(() => {
      messenger.send(toAddress, { message: "HELLO FROM IPFS 2" });
    }, 5000);
    setTimeout(async () => {
      messenger.stop();
    }, 10000);
    setTimeout(() => {
      messenger.disconnect(toAddress);
    }, 15000);
  });
  messenger.events.on("disconnected", (d) => {
    console.log(`Connection broke with ${d.address}`);
  });
  await messenger.start();
  await messenger.connect(toAddress);
})();

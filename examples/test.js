import * as IPFS from "ipfs-core";
import Messenger from "../index.js";
import config from "./ipfs-conf.js";

(async () => {
  const ipfs1 = await IPFS.create(config.config1);
  const ipfs2 = await IPFS.create(config.config2);
  const messenger1 = new Messenger(ipfs1, {});
  const messenger2 = new Messenger(ipfs2, {});
  messenger1.events.on("message", (message) => {
    console.log(JSON.parse(message.data));
  });
  messenger2.events.on("sent", (d) => {
    console.log("message sent", d);
  });
  await messenger1.start();
  await messenger2.start();
  const ipfs1Id = (await messenger1.identity).addresses[0].toString();
  console.log("CONNECTING TO OTHER NODE", ipfs1Id);
  await messenger2.connect(ipfs1Id);
  setTimeout(async () => {
    await messenger2.send(ipfs1Id, JSON.stringify({ msg: "Hello" }));
    console.log("MESSAGE ALMOST SENT");
  }, 1000);
})();

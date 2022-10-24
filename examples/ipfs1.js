import * as IPFS from "ipfs-core";
import config from "./ipfs-conf.js";
import Messenger from "../index.js";

(async () => {
  const ipfs = await IPFS.create(config.config1);
  const messenger = new Messenger(ipfs, {});
  messenger.events.on("start", (d) => {
    console.log(d.message);
  });
  messenger.events.on("message", (d) => {
    console.log(d.data);
  });
  await messenger.start();
})();

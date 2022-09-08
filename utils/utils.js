export const createChannel = async (ipfs, ipfsToConnect) => {
  try {
    await ipfs.swarm.connect(ipfsToConnect);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

export const removeChannel = async (ipfs, ipfsToDisconnect) => {
  try {
    await ipfs.swarm.disconnect(ipfsToDisconnect);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

export const encodeMessage = async (msg) => {
  return new Promise((resolve, reject) => {
    try {
      const encodedMsg = new TextEncoder().encode(msg);
      resolve(encodedMsg);
    } catch (e) {
      reject(e);
    }
  });
};

export const decodeMessage = async (msg) => {
  return new Promise((resolve, reject) => {
    try {
      const decodedMsg = new TextDecoder().decode(msg);
      resolve(decodedMsg);
    } catch (e) {
      reject(e);
    }
  });
};

export const sendMessage = async (ipfs, to, msg) => {
  try {
    const encodedMessage = await encodeMessage(msg);
    const response = await ipfs.pubsub.publish(to, encodedMessage);
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

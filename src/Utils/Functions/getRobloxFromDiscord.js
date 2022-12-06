const axios = require('axios');

async function runRoverCheck(DiscordId) {
  return new Promise((res, rej) => {
    axios.get(`https://verify.eryn.io/api/user/${DiscordId}`).then((roverRes) => {
      let roverData = roverRes.data;

      if (roverData && roverData.status == "error") {
        rej(null);
      };

      res(roverData.robloxId);
    }).catch((err) => {
      rej(err.toJSON());
    });
  });
}

async function runBloxLinkCheck(DiscordId) {
  return new Promise((res, rej) => {
    axios.get(`https://api.blox.link/v1/user/${DiscordId}`).then((bloxlinkRes) => {
      let bloxlinkData = bloxlinkRes.data;

      if (bloxlinkData && bloxlinkData.status == "error") {
        rej(null);
      };

      res(bloxlinkData.primaryAccount);
    }).catch((err) => {
      rej(err.toJSON());
    });
  });
};

async function getUserFromDiscord(DiscordId) {
  if (!DiscordId) return 'User not found.';
  
  try {
    let id = await runRoverCheck(DiscordId);
    return `https://roblox.com/users/${id}/profile`;
  } catch(err) {
    try {
      id = await runBloxLinkCheck(DiscordId);
      return `https://roblox.com/users/${id}/profile`;
    } catch(err) {
      return "User not found.";
    }
  }
};

module.exports = getUserFromDiscord;
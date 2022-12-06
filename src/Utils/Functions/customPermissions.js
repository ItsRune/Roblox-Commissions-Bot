const Discord = require('discord.js');
const axios = require('axios');
const GroupId = 0;

// Only pass Message and Members!
function hasPermission(Message, Permissions, Guild) {
  const Member = (Object.keys(Message).includes('author') !== null) ? Message.member : Message;
  let goodToRun = 0;
  Guild = (!Guild) ? Message.guild : Guild;

  for (let i = 0; i < Permissions.length; i++) {
    let permName = Permissions[i];

    if (String(permName).toLowerCase().includes("clientid")) {
      let idNeeded = String(permName).toLowerCase().split(":")[1];

      if (String(Member.id) === idNeeded) {
        goodToRun++;
      }
    } else if (String(permName).toLowerCase().includes("guildid")) {
      let idNeeded = String(permName).toLowerCase().split(":")[1];

      if (String(Guild.id) === idNeeded) {
        goodToRun++;
      }
    } else if (String(permName).toLowerCase().includes("ownership")) {
      if (Guild.ownerId === Member.id) {
        goodToRun++;
      }
    } else if (String(permName).toLowerCase().includes("grouprank")) {
      let rankAndAboveNeeded = String(permName).toLowerCase().split(":")[1]

      axios.get(`https://api.blox.link/v1/user/${Member.id}`).then((body) => {
        if (body.data && body.data.status == "ok") {
          Roblox.getGroups(Number(body.data.primaryAccount)).then((groups) => {
            for (let i = 0; i < groups.length; i++) {
              let group = groups[i];

              if (group.Id == GroupId && group.Rank >= Number(rankAndAboveNeeded)) {
                goodToRun++;
              }
            }
          }).catch((err) => {
            console.error(err);
          })
        }
      }).catch((err) => {
        console.error(err);
      });
    } else if (String(permName).toLowerCase().includes('channelid')) {
      const ChannelId = String(permName).toLowerCase().split(":")[1];

      if (String(Message.channel.id) == String(ChannelId)) {
        goodToRun++;
      }
    } else if (Member.hasPermission(Discord.Permissions.FLAGS[String(Permissions[i]).toUpperCase()])) {
      goodToRun++;
    }
  };

  if (Permissions.length > 0 && goodToRun > 0) {
    return true;
  } else if (Permissions.length === 0) {
    return true;
  }

  return false;
}

module.exports = hasPermission;
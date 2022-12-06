const CommandFormat = require('../../Utils/Formats/Commands');
const CreateEmbed = require('../../Utils/Functions/CreateEmbed');
const getRobloxFromDiscord = require('../../Utils/Functions/getRobloxFromDiscord');

class Command extends CommandFormat {
  constructor() {
    super('search', 'Searches for the Roblox user using Bloxlink and RoVer API\'s.', ['rbxser'], '<DiscordId>', [
      "channelid:945839772398657576"
    ]);
  };

  async run(Client, Message, Args) {
    let possibleId = Args[0];
    let accountLink = await getRobloxFromDiscord(possibleId);

    Message.reply(accountLink);
  };
};

module.exports = Command;
const CommandFormat = require('../../Utils/Formats/Commands');
const CreateEmbed = require('../../Utils/Functions/CreateEmbed');

class Command extends CommandFormat {
  constructor() {
    super('help', 'Displays the help message.', ['cmds', 'commands'], '', [
      "channelid:945839772398657576"
    ]);
  };

  async run(Client, Message, Args) {
    
  };
};

module.exports = Command;
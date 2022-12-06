const CommandFormat = require('../../Utils/Formats/Commands');
const CreateEmbed = require('../../Utils/Functions/CreateEmbed');

class Command extends CommandFormat {
  constructor() {
    super('closecomms', 'Closes commissions.', ['close'], '', [
      "administrator"
    ]);
  };

  async run(Client, Message, Args) {
    
  };
};
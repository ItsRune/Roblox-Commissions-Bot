const CommandFormat = require('../../Utils/Formats/Commands');
const CreateEmbed = require('../../Utils/Functions/CreateEmbed');

class Command extends CommandFormat {
  constructor() {
    super('ping', 'test', ['p'], '', []);
  };

  async run(Client, Message, Args) {
    
  };
};
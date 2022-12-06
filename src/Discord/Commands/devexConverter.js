const CommandFormat = require('../../Utils/Formats/Commands');
const CreateEmbed = require('../../Utils/Functions/CreateEmbed');

class Command extends CommandFormat {
  constructor() {
    super('devex', 'Converts either robux to usd or usd to robux.', ['convert'], '<Type> <Amount>', []);
  };

  addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async run(Client, Message, Args) {
    const Type = Args[0];
    const Amount = Args[1];
    const noCommaAmount = Amount.replace(/,/g, '');

    if ((!Type || !noCommaAmount) || (!Number(noCommaAmount)))
      return Message.reply(`Please double check the usage for this command.`);
    
    if (Type.toLowerCase() == "robux") {
      Message.reply(`${this.addCommas(noCommaAmount)} Robux to USD is \`${this.addCommas((noCommaAmount * 0.0035).toFixed(2))}\``);
    } else if (Type.toLowerCase() == "usd") {
      Message.reply(`${this.addCommas(noCommaAmount)} USD to robux is \`${this.addCommas(Math.floor(noCommaAmount / 0.0035))}\``);
    };
  };
};

module.exports = Command;
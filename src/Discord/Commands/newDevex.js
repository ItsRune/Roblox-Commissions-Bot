const CommandFormat = require('../../Utils/Formats/Commands');
const CreateEmbed = require('../../Utils/Functions/CreateEmbed');

class Command extends CommandFormat {
  constructor() {
    super('test', 'Creates a new dropdown and you can select which conversion you\d like.', [], '<Amount>', []);
  };

  addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async run(Client, Message, Args) {
    if (!Args[0])
      return Message.reply(`Please double check the usage for this command.`);
    
    const Amount = Args[0];
    const noCommaAmount = Amount.replace(/,/g, '');

    CreateEmbed(Message, 'Conversion', `Please use the dropdown below to select which conversion you'd like.`, 0xffffff, null, null, null, null, null, {
      Placeholder: "Select here",
      ID: `devex_${noCommaAmount}`,
      maxValues: 1,
      Options: [
        {
          Label: "Robux -> USD",
          Description: "Converts the amount from Robux to Usd",
          Value: "toUSD"
        },
        {
          Label: "USD -> Robux",
          Description: "Converts the amount from Usd to Robux",
          Value: "toRobux"
        }
      ]
    });
  };
};

// module.exports = Command;
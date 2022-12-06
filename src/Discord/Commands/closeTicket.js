const CommandFormat = require('../../Utils/Formats/Commands');
const CreateEmbed = require('../../Utils/Functions/CreateEmbed');

class Command extends CommandFormat {
  constructor() {
    super('closeticket', 'Closes all your existing tickets.', [], '', [
      "channelid:945839772398657576"
    ]);
  };

  async run(Client, Message, Args) {
    try {
      const Category = await Message.guild.channels.fetch('945853059135848520');

      Category.children.forEach(async (channel) => {
        if (String(channel.topic) == String(Message.author.id)) {
          const logChannel = await Client.channels.fetch('945837363995746314');
          await CreateEmbed(logChannel, `Ticket Closed`, `**Channel** \`${channel.name}\` **was deleted by** <@${Message.author.id}>`, 0xff7777);
          channel.delete();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
};
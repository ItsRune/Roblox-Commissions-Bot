const EventFormat = require('../../Utils/Formats/Events');
const switchStatus = require('../../Utils/Functions/SwitchStatus');
const updateQueue = require('../../Utils/Functions/updateQueue');
const checkSubscriptions = require('../../Utils/Functions/checkSubscriptions');
const CreateEmbed = require('../../Utils/Functions/CreateEmbed');
const fs = require('fs');
const path = require('path');

class Event extends EventFormat {
  constructor() {
    super('ready');
  };

  async run(Client) {
    console.log(`${Client.user.tag} is ready.`);

    //-- Activities --\\
    const Activities = [
      ["Commissions", "LISTENING"]
    ]
    Client.user.setPresence({
      activities: [{
        name: `Commissions`,
        type: "LISTENING"
      }],
      status: 'idle'
    });
    setInterval(switchStatus, 120000, Client, Activities);

    //-- Queue Updating --\\
    await updateQueue(Client);
    setInterval(async () => {
      await updateQueue(Client);
    }, 300000);

    //-- Subscription Checker --\\
    await checkSubscriptions();
    // setInterval(async () => {
    //   await checkSubscriptions();
    // }, 600000); // Checks every 10 minutes

    //-- Ticket Button --\\
    // try {
    //   const Channel = await Client.channels.fetch('945816202654142495');
    //   const filePath = path.join(__dirname, '../../Files/lastTicketMessageId.txt');
    //   const contents = (await fs.readFileSync(filePath)).toString();
      
    //   const newMessage = await CreateEmbed(Channel, `Commission Tickets`, `Click \`Open Ticket\` to open a new ticket.`, 0xffffff, null, null, null, null, [
    //     {
    //       Label: "Open Ticket",
    //       Color: "SECONDARY",
    //       ID: `open_ticket`
    //     }
    //   ]);
      
    //   const Message = await Channel.messages.fetch(contents);
    //   await Message.delete();
    //   fs.writeFile(filePath, String(newMessage.id), (err) => {
    //     if (err) {
    //       console.error(err);
    //     };
    //   });
    // } catch(err) {
    //   console.error(err);      
    // }
    
    //-- Change My Role --\\
    // try {
    //   const guild = await Client.guilds.fetch('945814938910335059');
    //   const role = await guild.roles.fetch('945837586545532979');

    //   role.setColor(0xff7369);
    // } catch (error) {
    //   console.error(error);
    // }
  };
};

module.exports = Event;
const Discord = require('discord.js');
const Roblox = require('noblox.js');
const CommandFormat = require('../../Utils/Formats/Commands');
const CreateEmbed = require('../../Utils/Functions/CreateEmbed');
const getRobloxId = require('../../Utils/Functions/getRobloxFromDiscord');
const { Client: Trello } = require('../../Trello/index');

class Command extends CommandFormat {
  constructor() {
    super('openticket', 'Opens a new ticket.', ['ticket'], '[What you need help with]', [
      "channelid:945816202654142495",
      "channelid:945839772398657576"
    ]);
  };

  async run(Client, Message, Args) {
    let gotten = false;
    let ticketCategory;
    
    try {
      ticketCategory = await Message.guild.channels.fetch('945853059135848520');
      gotten = true;
    } catch(err) {
      console.error(err);
    }

    if (gotten == false) return;
    let username = Message.author.username;
    let alreadyHasTicket = false;
    
    ticketCategory.children.forEach((c) => {
      if (c.topic === String(Message.author.id)) {
        alreadyHasTicket = true;
      };
    });

    if (alreadyHasTicket == true) {
      CreateEmbed(Message, "Tickets", "It appears you already have a ticket open. You can close it by either going to the channel and closing it or closing it underneath this message.", 0xffffff, null, null, null, null, [
        {
          Label: "Close Ticket",
          ID: `close_ticket_${Message.author.id}`,
          Color: "SUCCESS"
        }
      ]);
    } else {
      try {
        const Channel = await Message.guild.channels.create(`${username}'s-ticket`, {
          parent: '945853059135848520',
          topic: String(Message.author.id),
          type: 'GUILD_TEXT',
          permissionOverwrites: [
            {
              id: Message.member,
              allow: [
                'VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'
              ]
            },
  
            {
              id: Message.guild.roles.everyone.id,
              deny: [
                'VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'
              ]
            }
          ]
        });
        
        // confirmation list 6226f2378040983a3813649f
        const fetchedId = await getRobloxId(String(Message.member.id));
        const robloxId = /[0-9]+/g.exec(fetchedId)[0];
        let card = null;
        
        if (Number(robloxId) != NaN) {
          const robloxInfo = await Roblox.getPlayerInfo(Number(robloxId));
          card = await Trello.addCard(`${robloxInfo.username}-${robloxId}`, String(Message.member.id), '6226f2378040983a3813649f');
          await Trello.addLabelToCard(card.id, '6217256241c3e56a6617b0f1');
          await Trello.addChecklistToCard(card.id, 'Tasks');
        };

        CreateEmbed(Channel, "Commission Ticket", `${Message.author}, thank you for opening a ticket. A manager will be with you shortly.`, 0xffffff, null, null, null, null, [
          {
            Label: "Close Ticket",
            ID: `close_ticket_${Member.id}${(card != null) ? `_${card.id}` : ""}`,
            Color: "SUCCESS"
          }
        ], null, {
          content: "<@&945837700706091029>,"
        });
      } catch(err) {
        console.error(err);
      }
    };
  };
};

module.exports = Command;
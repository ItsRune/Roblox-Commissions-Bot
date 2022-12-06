const Roblox = require('noblox.js');
const EventFormat = require('../../Utils/Formats/Events');
const CreateEmbed = require('../../Utils/Functions/CreateEmbed');
const getRobloxId = require('../../Utils/Functions/getRobloxFromDiscord');
const { Client: Trello } = require('../../Trello/index');

class Event extends EventFormat {
  constructor() {
    super('interactionCreate');
  };

  async run(Client, Interaction) {
    const Member = Interaction.member;
    const Id = Interaction.customId;

    try {
      if (Interaction.isButton()) {
        if (Interaction.replied) return;
        const Message = Interaction.message;
        const guild = await Interaction.guild.fetch();
        const split = String(Id).split("_");

        if (Id.includes('close_ticket')) {
          const userId = split[2];
          const cardId = split[3];

          if (userId === String(Member.id) || Member.permissions.has('ADMINISTRATOR')) {
            const channelName = Message.channel.name;
            await Message.channel.delete();

            if (cardId != null) {
              const Card = await Trello.getCardById(cardId);
              if (Card.idList === '6226f2378040983a3813649f') {
                await Trello.deleteCard(Card.id);
              };
            };

            try {
              const logChannel = await Client.channels.fetch('945837363995746314');
              await CreateEmbed(logChannel, `Ticket Closed`, `**Channel** \`${channelName}\` **was deleted by** <@${Member.id}>`, 0xff7777);
            } catch (error) {
              console.error(error);
            }
            
            await Interaction.deferReply();
          } else {
            await Interaction.reply({content: `Only <@${userId}> may use this feature.`, ephemeral: true});
          };
        } else if (Id.includes('open_ticket')) {
          const Channel = await Client.channels.fetch('945853059135848520');
          let found = false;

          Channel.children.forEach(async (channel) => {
            if (channel.topic === String(Member.id)) {
              found = true;
              await Interaction.reply({
                content: `Please close your ticket before opening another one by clicking the button at the top of the ticket or typing \`${Client.Prefix}closeticket\`.`,
                ephemeral: true
              });
            };
          });
          if (found) return;

          const username = (Member.displayName != null) ? Member.displayName : Member.user.username;
          const newChannel = await guild.channels.create(`${username}'s-ticket`, {
            parent: '945853059135848520',
            topic: String(Member.id),
            type: 'GUILD_TEXT',
            permissionOverwrites: [
              {
                id: Member,
                allow: [
                  'VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'
                ]
              },
    
              {
                id: guild.roles.everyone.id,
                deny: [
                  'VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'
                ]
              }
            ]
          });

          // confirmation list 6226f2378040983a3813649f
          const fetchedId = await getRobloxId(String(Member.id));
          const robloxId = /[0-9]+/g.exec(fetchedId)[0];
          let card = null;
          
          if (Number(robloxId) != NaN) {
            const robloxInfo = await Roblox.getPlayerInfo(Number(robloxId));
            card = await Trello.addCard(`${robloxInfo.username}-${robloxId}`, String(Member.id), '6226f2378040983a3813649f');
            await Trello.addLabelToCard(card.id, '6217256241c3e56a6617b0f1');
            await Trello.addChecklistToCard(card.id, 'Tasks');            
          };

          await CreateEmbed(newChannel, "Commission Ticket", `${Member.user}, thank you for opening a ticket. My manager will be with you shortly.`, 0xffffff, null, null, null, null, [
            {
              Label: "Close Ticket",
              ID: `close_ticket_${Member.id}${(card != null) ? `_${card.id}` : ""}`,
              Color: "SUCCESS"
            }
          ], 
          null,
          {
            content: (String(Member.id) != "352604785364697091") ? "<@&945837700706091029>," : "Won't ping due to testing."
          });
          
          await Interaction.reply({
            content: `Your channel was successfully created. <#${newChannel.id}>`,
            ephemeral: true
          });
        };
      } else if (Interaction.isSelectMenu()) {
        const Message = Interaction.message;
        const guild = await Interaction.guild.fetch();
        const split = String(Id).split("_");

        if (Id.includes('devex_')) {
          const amount = split[1];
          const selected = Interaction.values[0];

          const type = (selected === "toUSD") ? `Your result from Robux to Usd is ` : `Your result from Usd to Robux is `
          const result = String((Number(amount) != null && selected === "toUSD") ? Number(amount) * .0035 : Math.floor(Number(amount) / .0035)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          
          let embeds = Message.embeds[0];
          let components = Message.components[0];
          embeds.description = `${type} ${result}`;

          await Interaction.update({
            embeds,
            components
          });
        };
      };
    } catch(err) {
      console.error(err);
      await Interaction.reply({
        content: `I ran into an error whilst processing your request, sorry for any inconvenience.`,
        ephemeral: true
      });
    }
  };
};

module.exports = Event;
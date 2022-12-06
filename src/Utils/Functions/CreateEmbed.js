const discord = require('discord.js');
const Client = require('../../Discord/index');

const getButtonData = async (ButtonData) => {
  return new Promise(async (resolve, reject) => {
    if (Array.isArray(ButtonData) && ButtonData.length > 0) {
      let buttons = [];
      for (let i = 0; i < ButtonData.length; i++) {
        const button = {};
        const { Label, Color, ID } = ButtonData[i];
        /*
          "type": 2,
          "label": "Click me!",
          "style": 1,
          "custom_id": "click_one"

          FORMAT:
          {
            Label: "Label",
            Color: "Color",
            ID: "ID",

            URL: "URL"
          }


          NAME	VALUE	COLOR	REQUIRED FIELD
          Primary	1	blurple	custom_id
          Secondary	2	grey	custom_id
          Success	3	green	custom_id
          Danger	4	red	custom_id
          Link	5	grey, navigates to a URL	url
        */
        if (!Label) continue;
        const colorType = getTypeFromColorName((Color) ? String(Color).toUpperCase() : "SECONDARY");
        button.type = 2;
        button.label = Label;
        button.style = colorType
        button.custom_id = (ID) ? ID : String(i);

        if (colorType == 5) {
          button.url = ButtonData[i].Url || "https://roblox.com/groups/1/"
        }

        buttons.push(button);
      }
      
      resolve(buttons);
    } else {
      resolve(undefined);
    }
  })
};

const getMenuData = async (MenuData) => {
  if (MenuData == undefined || !MenuData || typeof(MenuData) != "object") return undefined;
  return new Promise(async (resolve, reject) => {
    /*
      {
          type: 2,
          style: 1,
          label: "Apply",
          // Our button id, we can use that later to identify,
          // that the user has clicked this specific button
          custom_id: "send_application"
      }
    */
    const keys = Object.keys(MenuData);
    let maxValues = (keys.indexOf('maxValues') != null) ? MenuData.maxValues : (MenuData.Options.length != 0) ? MenuData.Options.length : 1
    
    let Menu = {
      type: 3,
      custom_id: MenuData.ID,
      options: [],
      placeholder: MenuData.Placeholder,
      min_values: 1,
      max_values: maxValues
    };
    
    let options = [];
    for (let i = 0; i < MenuData.Options.length; i++) {
      const optionData = MenuData.Options[i];
      const Option = {
        label: optionData.Label,
        value: optionData.Value,
        description: optionData.Description
      };

      if (optionData.Emoji) {
        Option["emoji"] = {
          name: optionData.Emoji.Name,
          id: optionData.Emoji.Id
        };
      }

      options.push(Option);
    };
    Menu.options.push(...options);
    Menu.max_values = Menu.options.length;

    resolve(Menu);
  })
};

/*
  NAME	VALUE	COLOR	REQUIRED FIELD
  Primary	1	blurple	custom_id
  Secondary	2	grey	custom_id
  Success	3	green	custom_id
  Danger	4	red	custom_id
  Link	5	grey, navigates to a URL	url
*/
function getTypeFromColorName(Name) {
  switch(Name) {
    case "PRIMARY":
      return 1;
    break;
    case "SECONDARY":
      return 2;
    break;
    case "SUCCESS":
      return 3;
    break;
    case "DANGER":
      return 4;
    break;
    case "LINK":
      return 5;
    break;
    default:
      return 1;
    break;
  }
}

async function CreateEmbed(Message, Title, Description, Color, Fields, Footer, Thumbnail, Author, ButtonData, MenuData, Extra={}) {
  ButtonsInformation = await getButtonData(ButtonData);
  MenuInformation = await getMenuData(MenuData);
  
  let author = {
    name: (Author != undefined && Object.keys(Author).filter(k => k === 'Name') != undefined) ? Author.Name : null,
    iconURL: (Author != undefined && Object.keys(Author).filter(k => k === 'Icon') != undefined) ? Author.Icon : null
  };
  let channel = null;

  if (!Message.channelId) {
    if (!Message.content) {
      channel = Message;
    } else {
      channel = Message.channel;
    }
  } else {
    channel = await Client.channels.fetch(Message.channelId);
  }

  const Options = {
    title: (Title != undefined) ? Title : "Rune's Assistant",
    description: (Description != undefined) ? Description : "",
    color: (Color != undefined) ? Color : 0x777777,
    fields: (Fields != undefined) ? Fields : [],
    thumbnail: (Thumbnail != undefined) ? Thumbnail : null,
    footer: {
      text: (Footer != undefined) ? Footer : ""
    },
    timestamp: Date.now()
  }
  
  if (author.name != undefined && author.iconURL != undefined) {
    Options["author"] = {
      name: author.name,
      icon: author.iconURL
    }
  }

  const thisEmbed = new discord.MessageEmbed(Options);

  try {
    let array = new Array();

    if (ButtonsInformation) {
      if (Array.isArray(ButtonsInformation)) {
        for (let i = 0; i < ButtonsInformation.length; i++) {
          array.push(ButtonsInformation[i]);
        }
      } else {
        array.push(ButtonsInformation);
      }
    }

    if (MenuInformation) {
      array.push(MenuInformation);
    }

    const components = [
      {
        type: 1,
        components: array
      }
    ]

    if (components[0].components.length > 0) {
      return await channel.send({embeds: [thisEmbed], components, ...Extra});
    } else {
      return await channel.send({embeds: [thisEmbed], ...Extra});
    }
  } catch(err) {
    console.error(err);
  }
};

module.exports = CreateEmbed;
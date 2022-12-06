const path = require('path');
const Trello = require('../../Trello/index');
const checkSubscription = require('./checkSubscriptions');
const statusMeanings = {
  "Not Started": ["<:notstarted:945892059544432660>", "Not Started"],
  "In Progress": ["<:started:945892073100414987>", "In Progress"],
  "Finished": ["<:completed:945892068000161824>", "Finished"],
};
let lastFormat = [];

function sortArrayByStatusAndPriority(formattedQueue) {
  let priority = [];
  let finished = [];
  let started = [];
  let notstarted = [];
  for (let i = 0; i < formattedQueue.length; i++) {
    const thisQueue = formattedQueue[i];

    if (thisQueue.options.Status === "Finished") {
      finished.push(thisQueue);
    } else if (thisQueue.options.Priority === true) {
      priority.push(thisQueue);
    } else if (thisQueue.options.Status === "In Progress") {
      started.push(thisQueue);
    } else if (thisQueue.options.Status === "Not Started") {
      notstarted.push(thisQueue);
    }
  };
  
  let len = started.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (started[j + 1] && started[j + 1].percentage > started[j].percentage) {
        let tmp = started[j + 1];
        started[j + 1] = started[j];
        started[j] = tmp;
      }
    }
  }

  let output = new Array()
    .concat(finished)
    .concat(priority)
    .concat(started)
    .concat(notstarted);
  
  return output;
};

function compareQueues(newlyFormatted) {
  if (newlyFormatted.length > lastFormat.length) {
    return true;
  } else {
    const len = newlyFormatted.length;
    // check individual percents and users
    let hasDiscrepancy = false;
    const valueOfOld = (lastFormat[0] != null) ? lastFormat[0].value : "different";
    const valueOfNew = (newlyFormatted[0] != null) ? newlyFormatted[0].value : "diff";

    hasDiscrepancy = (valueOfOld != valueOfNew);

    if (hasDiscrepancy === true) {
      lastFormat = newlyFormatted;
    };
    
    return hasDiscrepancy;
  };
};

async function formatQueue(Client, maxQueueSpots, areOpened) {
  const queue = await Trello.getQueueList();
  let formattedQueue = await Trello.formatListForQueue(queue);

  if (formattedQueue != null) {
    formattedQueue = sortArrayByStatusAndPriority(formattedQueue);
  };
  
  let fields = [
    {name:"Queue", value:``, inline: true},
    {name:"Finished", value:``, inline: true},
    {name:"Vacancy", value:``, inline: false}
  ];

  for (let i = 0; i < formattedQueue.length; i++) {
    const thisQueue = formattedQueue[i];
    const thisOptions = thisQueue.options;
    const Meaning = statusMeanings[thisOptions.Status]
    const optionKeys = Object.keys(thisOptions);
    const percentage = (thisOptions.Status === "Not Started") ? 0 : thisQueue.percentage;
    let tags = [];
    let user = await Client.users.fetch(thisQueue.DiscordId);
  
    if (optionKeys.includes('Priority')) {
      if (thisOptions.Priority === true) {
        tags.push(`<:priority:954645093510426644>`);
      };
    };

    if (thisOptions.Status === "Finished") {
      fields[1].value = `${fields[1].value}\n${user} - ${Meaning[1]} ${Meaning[0]} ${percentage}%`;
    } else {
      fields[0].value = `${fields[0].value}\n${user} - ${Meaning[1]} ${(tags.length > 0) ? `${tags.join(" ")}` : ""} ${Meaning[0]} ${percentage}%`;
    }
  };

  let ending = "";
  try {
    const displayChannel = await Client.channels.fetch('945815538062491709');
    
    if (queue.length == maxQueueSpots) {
      ending = "FULL";

      if (displayChannel.name.toLowerCase().includes('open')) {
        await displayChannel.setName("ㆍCOMMS CLOSEDㆍ");
      }
    } else if (queue.length > maxQueueSpots) {
      ending = "OVERFILLED";

      if (displayChannel.name.toLowerCase().includes('open')) {
        await displayChannel.setName("ㆍCOMMS CLOSEDㆍ");
      }
    } else {
      ending = "";
      
      if (displayChannel.name.toLowerCase().includes('closed')) {
        await displayChannel.setName("ㆍCOMMS OPENㆍ");
      }
    }
  } catch(err) {
    console.error(err);
  };
  
  fields[2].value = `[${queue.length}/${maxQueueSpots}] ${ending}`;

  for (let i = 0; i < fields.length; i++) {
    if (fields[i].value == "") {
      fields[i].value = `Empty`;
    };
  };
  
  return fields;
};

async function updateQueue(Client) {
  const Settings = require('../../../Settings.json');
  
  try {
    const updatedData = await formatQueue(Client, Settings.maxQueueSpots);
    const hasDiscrepancy = compareQueues(updatedData);

    if (hasDiscrepancy === true) {
      lastFormat = updatedData;
      const Channel = await Client.channels.fetch('945836807596171264');
      const Message = await Channel.messages.fetch('946305336833368085');
      
      Message.edit({
        content: "\t",
        embeds: [{
          title: `Commission Queue`,
          description: `This embed shows the list of usernames that are currently in queue for a commission.`,
          color: 0xffffff,
          fields: updatedData,
          timestamp: Date.now()
        }]
      });
    };
  } catch(err) {
    console.error(err);
  }
};

module.exports = updateQueue;
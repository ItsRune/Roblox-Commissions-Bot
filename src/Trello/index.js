const Trello = require('trello');
const Client = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_API_TOKEN);

async function getQueueList() {
  try {
    const List = await Client.getCardsForList("62171c62bb3259703796d13a");
    return List;
  } catch (error) {
    console.error(error);
  }
};

async function getSubscriptionList() {
  try {
    const List = await Client.getCardsForList("62171c6cebddb67ac05d192b");
    return List
  } catch (error) {
    console.error(error);
  }
}

function formatListForQueue(List) {
  let toReturn = [];
  for (let i = 0; i < List.length; i++) {
    const Card = List[i];
    const nameOfCard = Card.name;
    const splitName = String(nameOfCard).split("-");
    const userName = splitName[0];
    const userId = splitName[1];
    const DiscordId = Card.desc;
    const maxCheckList = Card.badges.checkItems;
    const checkedItems = Card.badges.checkItemsChecked;
    const boardName = "Queue";

    let percentCompleted = Math.floor((checkedItems / maxCheckList) * 100);    
    let options = {
      "Priority": false
    };

    if (Card.labels !== null) {
      for (let a = 0; a < Card.labels.length; a++) {
        const Label = Card.labels[a];
  
        if (Label.name === "PRIORITY") {
          options.Priority = true;
        };
  
        if (Label.name === "FINISHED") {
          options.Status = "Finished";
        } else if (Label.name === "IN-PROGRESS") {
          options.Status = "In Progress";          
        } else if (Label.name === "NOT-STARTED") {
          options.Status = "Not Started";
        };
      };
    };

    toReturn.push({
      Username: userName,
      UserId: userId,
      percentage: percentCompleted,
      DiscordId,
      options
    });
  };
  return toReturn;
};

module.exports = {
  getQueueList,
  getSubscriptionList,
  formatListForQueue,
  Client
}
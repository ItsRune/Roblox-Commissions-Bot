const { getSubscriptionList } = require('../../Trello/index');

async function checkSubscription() {
  const subscriptions = await getSubscriptionList();
  const now = Date.now();

  for (let i = 0; i < subscriptions.length; i++) {
    const Card = subscriptions[i];
    const discordId = Card.name;
    const prices = String(Card.desc).split("\n");
    const dueDate = Date.parse(Card.due);

    if (now >= dueDate) {
      for (let a = 0; a < prices.length; a++) {
        const thisPrice = prices[a].split(":");
        const typeOf = thisPrice[0]
        const price = thisPrice[1];
        const typeOfPrice = thisPrice[2];

        if (String(typeOf).toLowerCase() === "bot" || String(typeOf).toLowerCase() === "database") {
          
        };
      };
    };
  };
};

module.exports = checkSubscription;
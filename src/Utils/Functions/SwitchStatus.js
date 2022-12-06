function SwitchStatus(Client, Activities) {
  const randomActivity = Activities[Math.floor(Math.random() * Activities.length)];

  if (randomActivity[1].toUpperCase() == "WATCHING") {
    if (randomActivity[2] == null) {
      return SwitchStatus(Client);
    }
  }

  Client.user.setPresence({
    activities: [{
      name: randomActivity[0],
      type: String(randomActivity[1]).toUpperCase()
    }],
    status: (randomActivity[2] != null) ? randomActivity[2] : 'online'
  });
}

module.exports = SwitchStatus
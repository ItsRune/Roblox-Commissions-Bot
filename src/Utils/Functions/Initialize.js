const Client = require('../../Discord/index');
const App = require('../../Express/index');

const addCommands = require('./addCommands');
const addEvents = require('./addEvents');

async function Initialize() {
  try {
    await App.listen(process.env.PORT || 3000, () => console.log('API Online.'));
  } catch (error) {
    console.error(error);
  }
  
  try {
    await addCommands(Client, '../../Discord/Commands');
    await addEvents(Client, '../../Discord/Events');
    
    await Client.login(process.env.DISCORD_TOKEN);
  } catch(err) {
    console.error(err);
  }
};

module.exports = Initialize;
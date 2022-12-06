const EventFormat = require('../../Utils/Formats/Events');
const childProcess = require('child_process');

class Event extends EventFormat {
  constructor() {
    super('debug');
  };

  async run(Client, debugLog) {
    if (debugLog.includes('Hit a 429')) {
      childProcess.exec('kill 1');
    };
  };
};

module.exports = Event;
const fs = require('fs');
const path = require('path');
const baseRoute = require('../../Formats/baseRoute');
const Client = require('../../../Discord/index');
const { Client: Trello } = require('../../../Trello/index');
const processesPath = '../../../Files/processes.json';

class Route extends baseRoute {
  constructor() {
    super('/processid/get/:processId', 'get', []);
  };

  async run(req, res, next) {
    const { processId } = req.query;
    try {
      const fileInfo = JSON.parse(fs.readFileSync(path.join(__dirname, processesPath), 'utf-8'));

      for (let i = 0; i < fileInfo.length; i++) {
        const process = fileInfo[i];

        if (process.processId == processId) {
          res.json({Success:true, data: process});
          break;
        };
      };
    } catch (error) {
      res.json({Success:false, error:error.message});
    }
  };
};

module.exports = Route;
const baseRoute = require('../../Formats/baseRoute');
const Client = require('../../../Discord/index');
const { Client: Trello } = require('../../../Trello/index');

class Route extends baseRoute {
  constructor() {
    super('/', 'get', []);
  };

  async run(req, res, next) {
    return res.json({Success:true, Discord: (Client.uptime != null) ? true : false, Trello: true, API: true})
  }
};

module.exports = Route;
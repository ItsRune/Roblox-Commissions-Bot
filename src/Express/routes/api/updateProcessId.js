const fs = require('fs');
const path = require('path');
const axios = require('axios');
const baseRoute = require('../../Formats/baseRoute');
const Client = require('../../../Discord/index');
const { Client: Trello } = require('../../../Trello/index');
const processPath = '../../../Files/processes.json';

class Route extends baseRoute {
  constructor() {
    super('/processid/update', 'post', []);
  };

  async run(req, res, next) {    
    const processInfo = req.body;
    const keysOfInfo = Object.keys(processInfo);
    try {
      const currentInfo = JSON.parse(fs.readFileSync(path.join(__dirname, processPath), 'utf-8'));
      let found = null;

      if (keysOfInfo.indexOf('processId') === -1)
        return res.json({Success:false, error:"Invalid process id"});
      else if (keysOfInfo.indexOf('masterKey') === -1 || processInfo.masterKey != process.env.INIT_NEW_BOT_KEY)
        return res.json({Success:false, error:"Authorization error"});
      // else if (keysOfInfo.indexOf('') === -1)
      //   return res.json({Success:false, error:""});
      
      const IP = (keysOfInfo.indexOf('overwriteIP') === -1) ? req.headers['x-forwarded-for'] : processInfo.overwriteIP;

      for (let i = 0; i < currentInfo.length; i++) {
        if (currentInfo[i].processId == processInfo.processId) {
          found = currentInfo[i];
          found.index = i;
          break;
        };
      };

      if (found != null) {
        // found existing process
        found.IP = IP;

        delete currentInfo[i];
        currentInfo.push(found);

        fs.writeFileSync(path.join(__dirname, processPath), JSON.stringify(currentInfo, null, 2), 'utf-8');
        return res.json({Success:true, message:"Updated."});
      };

      // create new process document
      let newDoc = {
        processId: processInfo.processId,
        IP
      }

      axios.get(`http://${newDoc.IP}:8080/`).then((response) => {
        console.log(response);
        currentInfo.push(newDoc);
        fs.writeFileSync(path.join(__dirname, processPath), JSON.stringify(currentInfo, null, 2), 'utf-8');
      }).catch((err) => {
        res.json({Success:false, error:`Error: ${err.message}`});
      });
    } catch (error) {
      res.json({Success:false, error:error.message});
    }
  }
};

module.exports = Route;
const InovandoBot = require('../models/inovandoBot');
const { 
  TeamsActivityHandler
} = require('botbuilder');

class InovandoBotController extends TeamsActivityHandler {
  constructor() {
    super();
    this.inovandoBot = new InovandoBot();
    this.onMessage(async (context, next) => {
      const text = context.activity.text.trim().toLowerCase();
      if (!text.startsWith('!')) 
        return;
      const response = await this.getResponse(text, context);
      await context.sendActivity(response);  
      await next();
    });
  }
  
  async getResponse(text, context){
    return await this.inovandoBot.getResponse(text, context);
  }
}

module.exports = InovandoBotController;
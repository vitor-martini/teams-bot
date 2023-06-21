const { 
  TeamsActivityHandler
} = require('botbuilder');
const CommandEnum = require('../enums/commandEnum');
const { project, help, devHours, ticket, defaultAnswer, channel } = require('../commands/commands');

class InovandoBot extends TeamsActivityHandler {
  constructor() {
    super();
    this.conversationReferences = [];

    this.onMessage(async (context, next) => {
      const text = context.activity.text.trim().toLowerCase();
      if (!text.startsWith('!')) 
        return;
      
      const response = await this.getResponse(text, context);
      await context.sendActivity(response);  
      await next();
    });
  }

  async getResponse(text, context = null){
    const command = this.getCommand(text);
    const flags = this.getFlag(text);
    let response = '';

    switch(command) {
      case CommandEnum.ADM:
      case CommandEnum.PONTO:
      case CommandEnum.INTRANET:
      case CommandEnum.COMISSAO:
      case CommandEnum.SJ:
      case CommandEnum.RETOMADOS:
      case CommandEnum.RECOVERY:
          response = project(this.getProjectName(command), flags);
          break;
      case CommandEnum.HELP:
          response = help();
          break;
      case CommandEnum.HORASDEV:
          response = devHours();
          break;
      case CommandEnum.TICKET:
          response = ticket(flags);
          break;
      case CommandEnum.CANAL:
          response = await channel(this.conversationReferences, context);
          break;
      default:
          response = defaultAnswer();
    }
  
    return response;
  }

  getProjectName(command) {
    return command.replace("!","");
  }

  getCommand(inputString) {
    return inputString.split(/\s+/)[0];
  }

  getFlag(inputString) {
    return inputString.split(' ').slice(1); 
  }  
}

module.exports.InovandoBot = InovandoBot;

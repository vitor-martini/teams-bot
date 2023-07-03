const { project, help, devHours, ticket, defaultAnswer, channel, CommandEnum } = require('./commands');

class InovandoBot {

  constructor(){ }

  async getResponse(text, context = null) {
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
        response = await channel(context);
        break;
      default:
        response = defaultAnswer();
    }

    return response;
  }

  getProjectName(command) {
    return command.replace("!", "");
  }

  getCommand(inputString) {
    return inputString.split(/\s+/)[0];
  }

  getFlag(inputString) {
    return inputString.split(' ').slice(1); 
  } 
}

module.exports = InovandoBot;

const { Project } = require('../projects/project');
const { 
  TurnContext,
  TeamsInfo
} = require('botbuilder');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

function project(projectName, flags) {
  const project = new Project(projectName, flags);
  return project.response();
}

function help() {
  let response = `Comandos válidos:\n\n`;
  response += `\n      * !adm\n`;
  response += `\n      * !ponto\n`;
  response += `\n      * !intranet\n`;
  response += `\n      * !comissao\n`;
  response += `\n      * !sj\n`;
  response += `\n      * !retomados\n`;
  response += `\n      * !recovery\n`;
  response += `\n      * !horas-dev\n`;
  response += `\n      * !ticket\n`;
  response += `\n      * !canal\n`;
  response += `\n      * !help\n\n`;
  response += `OBS.: Todos os projetos podem incluir os comandos "config" ou um intervalo de datas. Exemplos:\n\n`;
  response += `\n      * !adm config\n`;
  response += `\n      * !adm 01/06/2023 30/06/2023\n`;
    
  return response;
}

function devHours() {
  let response = `Horas dev...`;
  return response;
}

function ticket(flags) {
  if(flags.length === 0)
    return "É necessário informar o número do ticket!"
  
  const ticketNum = parseInt(flags[0]);  
  
  if (isNaN(ticketNum)) 
    return "Número do ticket informado é inválido!";
  else 
    return "Dados do ticket " + flags[0];

}

async function channel(conversationReferences, context) {    
  let reference = TurnContext.getConversationReference(context.activity)
  delete reference.activityId;

  let member = await getMemberTeamsInfo(context)
  reference.member = member;
  addReference(reference, conversationReferences)

  return `ID do canal: ${reference.id}`;
}

async function getMemberTeamsInfo(context) {
  const userId = context.activity.from.aadObjectId;
  const members = await TeamsInfo.getMembers(context);
  const member = members.find(m => m.aadObjectId === userId);
  return member;
}

function addReference(reference, conversationReferences) {
  
  for (let item of conversationReferences) {
    if (_.isEqual(_.omit(item, 'id'), reference)) 
      return;    
  }

  reference.id = uuidv4();
  conversationReferences.push(reference);
}

function defaultAnswer() {
  return "Comando inválido. !help para listar todos os comandos.";
}

module.exports = {
  project,
  help,
  devHours,
  ticket,
  channel,
  defaultAnswer
};
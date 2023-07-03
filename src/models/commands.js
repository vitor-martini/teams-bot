const { Project } = require('./projects');
const { 
  TurnContext,
  TeamsInfo
} = require('botbuilder');
const _ = require('lodash');
const db = require('../db/connection');
const queries = require('../db/queries');
const { referenceToData } = require('./conversationReference');

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
  const response = `Horas dev...`;
  return response;
}

function ticket(flags) {
  if(flags.length === 0)
    return 'É necessário informar o número do ticket!'
  
  const ticketNum = parseInt(flags[0]);  
  
  if (isNaN(ticketNum)) 
    return 'Número do ticket informado é inválido!';
  else 
    return 'Dados do ticket ' + flags[0];

}

async function channel(context) {    
  const reference = TurnContext.getConversationReference(context.activity)
  delete reference.activityId;

  const member = await getMemberTeamsInfo(context)
  reference.member = member;
  
  const data = referenceToData(reference);
  const query = queries.insert('conversation_reference', data);

  let response = '';
  try {
    id = await db.one(query, [], a => a.id);
    response = `ID do canal: ${id}`;
  } catch (error) {
    console.error(`Erro ao inserir no banco de dados: ${error}`);
    response = 'Ocorreu um erro ao inserir o registro no banco de dados.';
  }
  
  return response;
}

async function getMemberTeamsInfo(context) {
  const userId = context.activity.from.aadObjectId;
  const members = await TeamsInfo.getMembers(context);
  const member = members.find(m => m.aadObjectId === userId);
  return member;
}

function defaultAnswer() {
  return 'Comando inválido. !help para listar todos os comandos.';
}

const CommandEnum = Object.freeze({
  ADM: '!adm',
  PONTO: '!ponto',
  INTRANET: '!intranet',
  COMISSAO: '!comissao',
  SJ: '!sj',
  RETOMADOS: '!retomados',
  RECOVERY: '!recovery',
  HELP: '!help',
  HORASDEV: '!horas-dev',
  TICKET: '!ticket',
  CANAL: '!canal'
});

module.exports = {
  project,
  help,
  devHours,
  ticket,
  channel,
  defaultAnswer,
  CommandEnum
};
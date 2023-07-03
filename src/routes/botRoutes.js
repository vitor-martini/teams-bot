const express = require('express');
const router = express.Router();
const { BotFrameworkAdapter } = require('botbuilder');
const InovandoBotController = require('../controllers/inovandoBotController')
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const db = require('../db/connection');
const queries = require('../db/queries');
const { dataToReference } = require('../models/conversationReference');

const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

const inovandoBotController = new InovandoBotController();

router.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await inovandoBotController.run(context);
  });
});

router.get('/api/conversation-references', async (req, res) => {
  const query = queries.selectAll('conversation_reference');

  try {
    const conversationReferences = await db.any(query);
    res.send(conversationReferences);  
  } catch (error) {
    console.error(`Erro ao buscar referências de conversa: ${error}`);
    res.status(500).send('Erro ao buscar referências de conversa');  
  }
});

const tasks = {};
router.post('/api/schedule', async (req, res) => {
  const commandText = req.body.command;
  const schedule = req.body.schedule;
  const conversationReferenceId = req.body.conversationReferenceId;
  let conversationReference;

  const query = queries.selectID('conversation_reference', conversationReferenceId);
  try {
    const data = await db.oneOrNone(query);
    if (!data) {
      res.status(404).send('Conversa não encontrada!');
      return;
    };
    conversationReference = dataToReference(data);
  } catch (error) {
    console.error(`Erro ao buscar referências de conversa: ${error}`);
    res.status(500).send('Erro ao buscar referências de conversa');  
  } 

  const response = await inovandoBotController.getResponse(commandText)

  const taskId = uuidv4();
  const task = cron.schedule(schedule, async () => {
    adapter.continueConversation(conversationReference, async turnContext => {
      await turnContext.sendActivity(response);
    });
  });

  tasks[taskId] = {
    conversationReferenceId: conversationReferenceId,
    command: commandText,
    schedule: schedule,
    created_at: new Date(),
    task: task, 
};

  res.send({ message: 'Mensagem agendada com sucesso!', id: taskId });
});

router.delete('/api/schedule/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const taskData = tasks[taskId];
  
  if (!taskData) {
      res.status(404).send('Agendamento não encontrado!');
      return;
  }

  taskData.task.stop(); 
  delete tasks[taskId];  

  res.send({ message: 'Agendamento excluído com sucesso!', id: taskId });
});

router.get('/api/schedule', (req, res) => {
  const viewTasks = _.mapValues(tasks, task => _.omit(task, 'task'));
  res.send(viewTasks);
});

router.get('/api/schedule/:conversationReferenceId', (req, res) => {
  const conversationReferenceId = req.params.conversationReferenceId;
  const viewTasks = _.mapValues(tasks, task => _.omit(task, 'task'));
  const filteredTasks = _.filter(viewTasks, t => t.conversationReferenceId === conversationReferenceId);
  res.send(filteredTasks);
});

router.get('/api/server-time', (req, res) => {
  const currentTime = new Date(); 
  res.send(currentTime.toLocaleString());
});

module.exports = router;

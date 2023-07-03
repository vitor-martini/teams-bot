const express = require('express');
const router = express.Router();
const { BotFrameworkAdapter } = require('botbuilder');
const InovandoBotController = require('../controllers/inovandoBotController')
const Task = require('../models/task')
const _ = require('lodash');
const db = require('../db/connection');
const queries = require('../db/queries');

const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});
const inovandoBotController = new InovandoBotController();
const tasks = {};

router.get('/', async (req, res) => { 
  try {
    const query = queries.selectAll('schedule');
    const scheduledTasks = await db.any(query);
    for (let scheduledTask of scheduledTasks) {
      let task = new Task(scheduledTask.command, 
                          scheduledTask.cron_schedule, 
                          scheduledTask.conversation_reference_id,
                          scheduledTask.id);        
      await task.schedule(adapter, inovandoBotController);

      if(task.taskReference) 
        tasks[task.id] = {task};      
    }
  } catch (error) {
    console.error(`Erro ao buscar agendamentos: ${error}`);
  }
});

router.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await inovandoBotController.run(context);
  });
});

router.get('/api/conversation-references', async (req, res) => {
  try {
    const query = queries.selectAll('conversation_reference');
    const conversationReferences = await db.any(query);
    res.send(conversationReferences);  
  } catch (error) {
    console.error(`Erro ao buscar referências de conversa: ${error}`);
    res.status(500).send('Erro ao buscar referências de conversa');  
  }
});

router.post('/api/schedule', async (req, res) => {  
  const command = req.body.command;
  const cronSchedule = req.body.cronSchedule;
  const conversationReferenceId = req.body.conversationReferenceId;

  const task = new Task(command, 
                        cronSchedule, 
                        conversationReferenceId);        

  await task.schedule(adapter, inovandoBotController);
  await task.insert();

  if(!task.taskReference)
    res.status(500).send('Houve um problema ao agendar a tarefa!');  
  
  res.send(`Tarefa agendada com sucesso! ID: ${task.id}`);
  tasks[task.id] = task;     
});

router.delete('/api/schedule/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const task = tasks[taskId];
    
  if (!task) {
      res.status(404).send('Agendamento não encontrado!');
      return;
  }

  await task.stop(tasks);  
  if(tasks[taskId]){
    res.status(500).send('Erro ao excluir registro no banco de dados.');
  }

  res.send({ message: 'Agendamento excluído com sucesso!', id: taskId });
});

router.get('/api/schedule', (req, res) => {
  console.log(tasks)
  const viewTasks = _.mapValues(tasks, task => _.omit(task, 'taskReference'));
  res.send(viewTasks);
});

router.get('/api/schedule/:conversationReferenceId', (req, res) => {
  const conversationReferenceId = req.params.conversationReferenceId;
  const viewTasks = _.mapValues(tasks, task => _.omit(task, 'taskReference'));
  const filteredTasks = _.filter(viewTasks, t => t.conversationReferenceId === conversationReferenceId);
  res.send(filteredTasks);
});

router.get('/api/server-time', (req, res) => {
  const currentTime = new Date(); 
  res.send(currentTime.toLocaleString());
});

module.exports = router;

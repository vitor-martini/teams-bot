require("dotenv").config();
const express = require("express");
const { BotFrameworkAdapter, MessageFactory } = require("botbuilder");
const { InovandoBot } = require("./src/bots/bot")
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const _ = require('lodash');

const app = express();
app.use(bodyParser.json());

const server = app.listen(process.env.PORT || 3978, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    server.address().port,
    app.settings.env
  );
});
;

const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

const onTurnErrorHandler = async (context, error) => {
  console.error(`\n [onTurnError] unhandled error: ${error}`);
  await context.sendTraceActivity(
    "OnTurnError Trace",
    `${error}`,
    "https://www.botframework.com/schemas/error",
    "TurnError"
  );
  await context.sendActivity("The bot encountered an error or bug.");
  await context.sendActivity(
    "To continue to run this bot, please fix the bot source code."
  );
};

adapter.onTurnError = onTurnErrorHandler;
const inovandoBot = new InovandoBot();

app.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await inovandoBot.run(context);
  });
});

app.get('/api/conversation-references', (req, res) => {
  res.send(inovandoBot.conversationReferences);
});

const tasks = {};
app.post('/api/schedule', async (req, res) => {
  let commandText = req.body.command;
  let schedule = req.body.schedule;
  let conversationReferenceId = req.body.conversationReferenceId;
  let conversationReference = inovandoBot.conversationReferences.find(conversation => conversation.id === conversationReferenceId);
  let response = await inovandoBot.getResponse(commandText)

  if (!conversationReference) {
      res.status(404).send('Conversa não encontrada!');
      return;
  }

  let taskId = uuidv4();
  let task = cron.schedule(schedule, async () => {
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

app.delete('/api/schedule/:taskId', (req, res) => {
  let taskId = req.params.taskId;
  let taskData = tasks[taskId];
  
  if (!taskData) {
      res.status(404).send('Agendamento não encontrado!');
      return;
  }

  taskData.task.stop(); 
  delete tasks[taskId];  

  res.send({ message: 'Agendamento excluído com sucesso!', id: taskId });
});

app.get('/api/schedule', (req, res) => {
  const viewTasks = _.mapValues(tasks, task => _.omit(task, 'task'));
  res.send(viewTasks);
});

app.get('/api/schedule/:conversationReferenceId', (req, res) => {
  let conversationReferenceId = req.params.conversationReferenceId;
  const viewTasks = _.mapValues(tasks, task => _.omit(task, 'task'));
  const filteredTasks = _.filter(viewTasks, t => t.conversationReferenceId === conversationReferenceId);
  res.send(filteredTasks);
});

app.get('/api/server-time', (req, res) => {
  const currentTime = new Date(); 
  res.send(currentTime.toLocaleString());
});
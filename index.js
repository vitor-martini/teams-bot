require("dotenv").config();
const express = require("express");

const app = express();
const server = app.listen(process.env.PORT || 3978, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    server.address().port,
    app.settings.env
  );
});

const { 
    BotFrameworkAdapter,
    ConversationState,
    MemoryStorage,
    UserState
} = require("botbuilder");
const { InovandoBot } = require("./src/bots/bot");
const { MainDialog } = require('./src/dialogs/mainDialog');

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
  await conversationState.delete(context);
};

// adapter.onTurnError = onTurnErrorHandler;


const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);

const dialog = new MainDialog('mainDialog');
const myBot = new InovandoBot(conversationState, userState, dialog);

app.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await myBot.run(context);
  });
});



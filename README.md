# Assistente Virtual

This bot has been created using [Bot Framework](https://dev.botframework.com), it brings information about the status of projects.

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14.1 or higher

  ```bash
  # determine node version
  node --version
  ```

## To run the bot

- Install modules

  ```bash
  npm install
  ```

- Start the bot

  ```bash
  npm start
  ```

## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.9.0 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`

## Deploy the bot to Teams

- Search for "Developer Portal" on Teams app store. First we need to create the bot, after that the app.
- Tools -> Bot management -> New Bot.
  - Give a name to the bot.
  - On "Configure" tab, put que URL where the bot is deployed followed by /api/messages e.g. `https://bot-inovan.do/api/messages`.
  - On "Client secrets" tab, click on "Add a client secret for your bot". Copy the generated GUID.
  - Back on "Tools -> Bot management" copy the Bot GUID.
  - Change the .env file where the bot is deployed. The MicrosoftAppId var needs to match the Bot generate ID and MicrosoftAppPassword the bot generated password.
- Back on the Developer Portal on teams, go to Apps -> New App.
  - Give a name to the app.
  - Complete the mandatory fields.
  - Go to Configure -> App Features -> Bots.
  - On "Select and existing bot" combo, select the created bot.
- Save and publish. After that the members of the team can add the app on their teams account.

## Further reading

- [Bot Framework Documentation](https://docs.botframework.com)
- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Dialogs](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-dialog?view=azure-bot-service-4.0)
- [Gathering Input Using Prompts](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-prompts?view=azure-bot-service-4.0)
- [Activity processing](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-concept-activity-processing?view=azure-bot-service-4.0)
- [Azure Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)
- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0)
- [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)
- [Azure Portal](https://portal.azure.com)
- [Language Understanding using LUIS](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/)
- [Channels and Bot Connector Service](https://docs.microsoft.com/en-us/azure/bot-service/bot-concepts?view=azure-bot-service-4.0)
- [Restify](https://www.npmjs.com/package/restify)
- [dotenv](https://www.npmjs.com/package/dotenv)

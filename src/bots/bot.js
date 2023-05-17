const { 
  TeamsActivityHandler, 
  MessageFactory,
  TeamsInfo,
  Activity, 
  ActivityHandler, 
  ActivityTypes, 
  Mention, 
  BotState,
  ChannelAccount,
  ConversationState,
  StatePropertyAccessor,
  TurnContext,
  UserState 
} = require('botbuilder');
const {
  Dialog,
  DialogState 
} = require('botbuilder-dialogs');
const { MainDialog } = require('../dialogs/mainDialog');

class InovandoBot extends TeamsActivityHandler {
  constructor(
    conversationState,
    userState,
    dialog
  ) {
    super();

    if (!conversationState) {
      throw new Error('[InovandoBot]: Missing parameter. conversationState is required');
    }
    if (!userState) {
        throw new Error('[InovandoBot]: Missing parameter. userState is required');
    }
    if (!dialog) {
        throw new Error('[InovandoBot]: Missing parameter. dialog is required');
    }

    this.conversationState = conversationState;
    this.userState = userState;
    this.dialog = dialog;
    this.dialogState = this.conversationState.createProperty('DialogState');


    this.onMessage(async (context, next) => {
      await this.dialog.run(context, this.dialogState);

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onDialog(async (context, next) => {
      // Save any state changes. The load happened during the execution of the Dialog.
      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

  }

  async handleMessage(context, next) {

    await(this.dialog).run(context, this.dialogState);
    
    const replyText = `echo: *${ context.activity.text }*`; 
    await context.sendActivity(MessageFactory.text(replyText)); 

    await next();
  }

  async getMemberTeamsInfo(context) {
    const userId = context.activity.from.aadObjectId;
    const member = await TeamsInfo.getMember(context, userId);
    return member;
  }

  async messageWithMention(context) {    
    const mention = {
        mentioned: context.activity.from,
        text: `<at>${context.activity.from.name}</at>`,
        type: 'mention'
    };

    const message = {
        entities: [mention],
        text: `${mention.text} You said '${ context.activity.text }'`,
        type: ActivityTypes.Message
    };

    await context.sendActivity(message);
  }

}

module.exports.InovandoBot = InovandoBot;

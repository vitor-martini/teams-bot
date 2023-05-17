const {
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogTurnResult,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext
} = require('botbuilder-dialogs');

const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class OwnerResolverDialog extends ComponentDialog {
  
    static async ownerPromptValidator(promptContext) {
      if (promptContext.recognized.succeeded) {
        
        const owner = promptContext.recognized.value;
        if (!OwnerResolverDialog.validateEmail(owner)) {
          promptContext.context.sendActivity('Malformatted email adress.');
          return false;
        } else {
          return true;
        }
  
      } else {
        return false;
      }
    }
  
    static validateEmail(email) {
      const re = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i;
      return re.test(email);
    }
  
    constructor(id) {
      super(id || 'ownerResolverDialog');
      
      this
          .addDialog(
              new TextPrompt(TEXT_PROMPT, OwnerResolverDialog.ownerPromptValidator.bind(this))
          ).addDialog(
              new WaterfallDialog(WATERFALL_DIALOG, [
                  this.initialStep.bind(this),
                  this.finalStep.bind(this)
              ]));
  
      this.initialDialogId = WATERFALL_DIALOG;
    }
  
    async initialStep(stepContext) {
      const siteDetails = stepContext.options.siteDetails;
  
      const promptMsg = 'Provide an owner email';
  
      if (!siteDetails.owner) {
        return await stepContext.prompt(TEXT_PROMPT, {
          prompt: promptMsg
        });
      } else {
        return await stepContext.next(siteDetails.owner);
      }
    }
  
    async finalStep(stepContext) {
      const owner = stepContext.result;
      return await stepContext.endDialog(owner);
    }
  }

module.exports.OwnerResolverDialog = OwnerResolverDialog;
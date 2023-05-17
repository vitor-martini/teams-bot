const { 
    StatePropertyAccessor, 
    TurnContext 
} = require('botbuilder'); 
const {
    ComponentDialog,
    DialogSet,
    DialogState,
    DialogTurnResult,
    DialogTurnStatus,
    WaterfallDialog,
    WaterfallStepContext
} = require('botbuilder-dialogs');
const { SiteDialog } = require('./siteDialog');
const { SiteDetails } = require('./siteDetails');


const SITE_DIALOG = 'siteDialog';
const MAIN_WATERFALL_DIALOG = 'waterfallDialog';

class MainDialog extends ComponentDialog {
    constructor(id) {
        super(id);

        this.addDialog(new SiteDialog(SITE_DIALOG))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.initialStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }


    async run(context, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    /**
     * Initial step in the waterfall. This will kick of the site dialog
     */
    async initialStep(stepContext) {
        const siteDetails = new SiteDetails();
        return await stepContext.beginDialog(SITE_DIALOG, siteDetails);
    }

    /**
     * This is the final step in the main waterfall dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result) {
            const result = stepContext.result;
            const msg = `I have created a ${ JSON.stringify(result) }`;
            await stepContext.context.sendActivity(msg);
        }
        return await stepContext.endDialog();

    }
}

module.exports.MainDialog = MainDialog;
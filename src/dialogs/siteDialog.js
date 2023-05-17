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

const { OwnerResolverDialog } = require('./ownerResolverDialog');

// const axios = require('axios').default;
const TEXT_PROMPT = 'textPrompt';
const CHOICE_PROMPT = 'choicePrompt';
const OWNER_RESOLVER_DIALOG = 'ownerResolverDialog';
const CONFIRM_PROMPT = 'confirmPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class SiteDialog extends ComponentDialog {
    constructor(id){
        super(id || 'siteDialog');
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new OwnerResolverDialog(OWNER_RESOLVER_DIALOG))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.siteTypeStep.bind(this),
                this.titleStep.bind(this),
                this.descriptionStep.bind(this),
                this.ownerStep.bind(this),
                this.aliasStep.bind(this),
                this.confirmStep.bind(this),
                this.finalStep.bind(this)
            ]));
        this.initialDialogId = WATERFALL_DIALOG;
    }

    async siteTypeStep(stepContext) {
        const siteDetails = stepContext.options;

        if (!siteDetails.siteType) {

            return await stepContext.prompt(CHOICE_PROMPT, {
                choices: ChoiceFactory.toChoices(['Team Site', 'Communication Site']),
                prompt: 'Select site type.'
            });

        } else {
            return await stepContext.next(siteDetails.siteType);
        }
    }
    
    /**
     * If a title has not been provided, prompt for one.
     */
    async titleStep(stepContext) {
        const siteDetails = stepContext.options;

        siteDetails.siteType = stepContext.result.value;

        if (!siteDetails.title) {

            const promptText = 'Provide a title for your site';
            return await stepContext.prompt(TEXT_PROMPT, { prompt: promptText });
        } else {
            return await stepContext.next(siteDetails.title);
        }
    }

    /**
     * If a description has not been provided, prompt for one.
     */
    async descriptionStep(stepContext) {
        const siteDetails = stepContext.options;

        // Capture the results of the previous step
        siteDetails.title = stepContext.result;
        if (!siteDetails.description) {
            const text = 'Provide a description for your site';
            return await stepContext.prompt(TEXT_PROMPT, { prompt: text });    
        } else {
            return await stepContext.next(siteDetails.description);
        }
    }

    /**
     * If an owner has not been provided, prompt for one.
     */
    async ownerStep(stepContext) {
        const siteDetails = stepContext.options;

        // Capture the results of the previous step
        siteDetails.description = stepContext.result;

        if (!siteDetails.owner) {
            return await stepContext.beginDialog(OWNER_RESOLVER_DIALOG, { siteDetails });
        } else {
            return await stepContext.next(siteDetails.owner);
        }
    }

    /**
     * If an owner has not been provided, prompt for one.
     */
    async aliasStep(stepContext) {
        const siteDetails = stepContext.options;

        // Capture the results of the previous step
        siteDetails.owner = stepContext.result;
        
        // Don't ask for alias if a communication site
        if (siteDetails.siteType === 'Communication Site') {
            
            return await stepContext.next();
        
        // Otherwise ask for an alias
        } else {
            
            if (!siteDetails.alias) {
                const text = 'Provide an alias for your site';
                return await stepContext.prompt(TEXT_PROMPT, { prompt: text });
            } else {
                return await stepContext.next(siteDetails.alias);
            }
        }
    }

    /**
     * Confirm the information the user has provided.
     */
    async confirmStep(stepContext) {
        const siteDetails = stepContext.options;

        // Capture the results of the previous step
        siteDetails.alias = stepContext.result;
        
        const msg = `A summary of your request:\n 
        Title: ${ siteDetails.title} \n\n
        Owner: ${ siteDetails.owner} \n\n
        Description: ${ siteDetails.description} \n\n
        Site type: ${ siteDetails.siteType} \n\n
        Alias: ${ siteDetails.alias}, \n\n
        Is this correct?`;

        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result === true) {
            const siteDetails = stepContext.options;

            return await stepContext.endDialog(siteDetails);
        } else {
            return await stepContext.endDialog();
        }
    }
}

module.exports.SiteDialog = SiteDialog;
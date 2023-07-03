const cron = require('node-cron');
const db = require('../db/connection');
const queries = require('../db/queries');
const { dataToReference } = require('./conversationReference');

class Task {
    constructor(command, cronSchedule, conversationReferenceId, id = null){    
        this.id = id; 
        this.command = command;
        this.cronSchedule = cronSchedule;
        this.conversationReferenceId = conversationReferenceId;
    }

    async schedule(adapter, inovandoBotController){
        const conversationReference = await this.getConversationReference();
        if(!conversationReference) 
            return;

        const response = await inovandoBotController.getResponse(this.command);
        const task = cron.schedule(this.cronSchedule, async () => {
            adapter.continueConversation(conversationReference, async context => {
                await context.sendActivity(response);
            });
        });
        
        this.taskReference = task;
    }
    
    async insert(){
        const scheduleData = {
            command: this.command,
            cron_schedule: this.cronSchedule,
            conversation_reference_id: this.conversationReferenceId
        }        
        try {
            const query = queries.insert('schedule', scheduleData);
            const taskId = await db.one(query, [], x => x.id);
            this.id = taskId;
        } catch (error) {
            console.error(`Erro ao inserir no banco de dados: ${error}`);
        }
    }

    async stop(tasks){
        this.taskReference.stop(); 
        try {
            const query = queries.deleteID('schedule', this.id);
            await db.none(query);
            delete tasks[this.id]; 
        } catch (error) {
            console.error(`Erro ao excluir registro no banco de dados: ${error}`);
        }
    }

    async getConversationReference(){
        try {
            const query = queries.selectID('conversation_reference', this.conversationReferenceId);
            const data = await db.oneOrNone(query);
            if (!data) 
                return;

            return dataToReference(data);
        } catch (error) {
            console.error(`Erro ao buscar referências de conversa: ${error}`);
            return;
        } 
    }
}

module.exports = Task;
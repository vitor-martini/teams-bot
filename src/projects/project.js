const { info } = require('./projects-info');
const { isValidDate, isValidDateRange } = require('../shared/utils')

class Project {
    constructor(name, flags){
        this.name = name;
        this.flags = flags;
    }

    response(){
        if (this.flags[0] == "config") {
            let config = `O projeto requer as seguintes tecnologias: ${info[this.name].config}`; 
            config += ` \nConsulte a disponibilidade do instalador em: ${info.urlFiles}`
            return config;
        }

        if (this.isDateRange()) {
            let tickets = `Tickets no intervalo...`; 
            return tickets;
        }

        let hours = `X horas consumidas.  \n`;   
        let tickets = `Informações sobre os tickets...  \n`;  
        return hours + tickets; 
    }

    isDateRange(){
        if(this.flags.lenght < 2)
            return false;

        let startDate = this.flags[0];
        let endDate = this.flags[1];

        if(!isValidDate(startDate))
            return false;
        if(!isValidDate(endDate))
            return false;

        if(!isValidDateRange(startDate, endDate))
            return false;
        
        return true;
    }
}

module.exports.Project = Project;
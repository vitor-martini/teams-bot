const { isValidDate, isValidDateRange } = require('../utils/utils')

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
            const tickets = `Tickets no intervalo...`; 
            return tickets;
        }

        const hours = `X horas consumidas.  \n`;   
        const tickets = `Informações sobre os tickets...  \n`;  
        return hours + tickets; 
    }

    isDateRange(){
        if(this.flags.lenght < 2)
            return false;

        const startDate = this.flags[0];
        const endDate = this.flags[1];

        if(!isValidDate(startDate))
            return false;
        if(!isValidDate(endDate))
            return false;

        if(!isValidDateRange(startDate, endDate))
            return false;
        
        return true;
    }
}

const info = {
    adm: {
        config: `  \n* PHP 5.6  \n* Xampp 3.2  \n* SGBD (recomendado Dbeaver)  \n* Git  \n* FortiClient VPN  \n`
    },
    ponto: {
        config: `  \n* .Net Framework 4.0  \n* SGBD (recomendado Dbeaver)  \n* Visual Studio  \n* Git  \n* FortiClient VPN  \n`
    },
    intranet: {
        config: `  \n* Visual Studio Code  \n* NVM  \n* Node 10.24.1  \n* Git  \n* FortiClient VPN  \n`
    },
    comissao: {
        config: `  \n* Mongodb e Mongodbcompass  \n* Angular cli 8.0.2  \n* NVM  \n* Node 10.24.1  \n* .NET Framework 2.2  \n* SGBD (recomendado Dbeaver)  \n* Visual Studio  \n* Git  \n* FortiClient VPN  \n`
    } ,
    sj: {
        config: `  \n* SGBD (recomendado Dbeaver)  \n* Visual Studio  \n* Git  \n* FortiClient VPN  \n`
    },
    retomados:  {
        config: `  \n* .NET Framework 2.2  \n* NVM  \n* Node 6.17.1  \n* SGBD (recomendado Dbeaver)  \n* Visual Studio  \n* Git  \n* FortiClient VPN  \n`
    },
    recovery:  {
        config: `  \n* SGBD (recomendado Dbeaver)  \n* Visual Studio  \n* Git  \n* FortiClient VPN  \n* Postman  \n`
    },
    urlFiles: `https://shre.ink/inovando-bot`
  };

module.exports = {
    Project,
    info
};
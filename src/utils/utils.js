function isValidDate(dateString) {
    const regexDate = /^(\d{2})\/(\d{2})\/(\d{4})$/;    
    if (!regexDate.test(dateString)) return false;
    
    const splitDate = dateString.split('/');
    const day = parseInt(splitDate[0], 10);
    const month = parseInt(splitDate[1], 10) - 1;
    const year = parseInt(splitDate[2], 10);
    
    const date = new Date(year, month, day);

    return (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
    );
}  

function stringToDate(dateString) {    
    const splitDate = dateString.split('/');
    const day = parseInt(splitDate[0], 10);
    const month = parseInt(splitDate[1], 10) - 1;
    const year = parseInt(splitDate[2], 10);
    
    return new Date(year, month, day);
}  

function isValidDateRange(startDate, endDate){
    startDate = stringToDate(startDate);
    endDate = stringToDate(endDate);

    return startDate <= endDate;
}

module.exports = {
    isValidDate,
    isValidDateRange
}
  
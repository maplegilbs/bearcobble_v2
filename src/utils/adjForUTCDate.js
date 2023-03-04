//Adjusting UTC time to EST time
export function adjustForUTC(timeToConvert){
    let currentHours = timeToConvert.getUTCHours();
    let hourDiff = 5;
    timeToConvert.setUTCHours(currentHours-hourDiff);
    return timeToConvert;
}
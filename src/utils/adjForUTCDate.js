//Adjusting UTC time to EST time for remote db only
export function adjustForUTC(timeToConvert){
    let currentHours = timeToConvert.getUTCHours();
    // let hourDiff = 0;
    let hourDiff = 5;
    timeToConvert.setUTCHours(currentHours-hourDiff);
    return timeToConvert;
}
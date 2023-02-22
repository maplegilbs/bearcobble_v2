//formattingTime for display with Current Conditions section

export function formatTime(inputTime) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	let dow = weekdays[inputTime.getDay()];
	let day = inputTime.getDate();
	let month = inputTime.getMonth();
	month++ 
	let year = inputTime.getFullYear();
	let hour = inputTime.getHours();
	let amPM = "am";
	if (hour==12) {amPM="pm"}
	if(hour>12) {hour = hour-12; amPM = "pm"}
	let minute = inputTime.getMinutes();
	if(minute < 10) {minute = "0"+minute.toString()}
    return(
        {
            dow: dow,
            date: `${month}/${day}`, 
            time: `${hour}:${minute}`,
            amPm: amPM,
            inputTime: inputTime
        }
    )
}
//formattingTime for display with Current Conditions section

export function formatTime(inputTime) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	let dow = weekdays[inputTime.getDay()];
	let day = inputTime.getDate();
	if(day < 10) {day = "0"+day.toString()}
	let month = inputTime.getMonth();
	month++ 
	if(month < 10) {month = "0"+month.toString()}
	let year = inputTime.getFullYear();
	let hour24 = inputTime.getHours();
	let hour;
	let amPM = "am";
	if (hour24==12) {amPM="pm"}24
	if(hour24>12) {hour = hour24-12; amPM = "pm"}
	let minute = inputTime.getMinutes();
	if(minute < 10) {minute = "0"+minute.toString()}
    return(
        {
            dow: dow,
			month: month,
			day: day,
			year: year,
            date: `${month}/${day}`, 
            time: `${hour}:${minute}`,
			time24Hr: `${hour24}:${minute}`,
            amPm: amPM,
            inputTime: inputTime
        }
    )
}
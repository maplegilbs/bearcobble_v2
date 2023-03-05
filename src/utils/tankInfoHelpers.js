//Calculate the volume in the tank based on the height
export function calcVolFromHeight(height) {

    const radius = 45;
    const volPerInHeight = 111.5;

    if (height < 1) {
        let volume = 0;
        return volume;
    }

    else if (height < 45) {
        let x = (radius - height) / radius;
        let y = (2 * radius * height - Math.pow(height, 2));
        let volume = (Math.pow(radius, 2) * Math.acos(x) - (radius - height) * Math.sqrt(y)) * 286 / 231;
        return Math.round(volume);

    }

    else {
        let volume = 3827 + (height - 44) * volPerInHeight;
        return Math.round(volume);
    }

}

export let cautionFlag = "black";
export function remainingFillTime(currentLevel, fillRate) {
  const maxFill = 8500;
  if (currentLevel <= 0) {
    cautionFlag = "black";
    return "EMPTY";
  } else if (currentLevel >= maxFill) {
    cautionFlag = "black";
    return "FULL";
  } else if (fillRate > 0) {
    let timetofull = (maxFill - currentLevel) / fillRate;
    switch (true) {
      case Math.abs(timetofull) > 1.5:
        cautionFlag = "green";
        break;
      case Math.abs(timetofull) > 0.75:
        cautionFlag = "orange";
        break;
      case Math.abs(timetofull) > 0:
        cautionFlag = "red";
        break;
      default:
        cautionFlag = "black";
    }
    let hours = Math.floor(timetofull);
    let minutes = Math.floor((timetofull - hours) * 60);
    if (minutes < 10) {
      minutes = "0" + minutes.toString();
    }
    return hours + "h" + minutes + "m";
  } else if (fillRate < 0) {
    let timetoempty = (0 - currentLevel) / fillRate;
    switch (true) {
      case Math.abs(timetoempty) > 1.5:
        cautionFlag = "green";
        break;
      case Math.abs(timetoempty) > 0.75:
        cautionFlag = "orange";
        break;
      case Math.abs(timetoempty) > 0:
        cautionFlag = "red";
        break;
      default:
        cautionFlag = "black";
    }
    let hours = Math.floor(timetoempty);
    let minutes = Math.floor((timetoempty - hours) * 60);
    if (minutes < 10) {
      minutes = "0" + minutes.toString();
    }
    return hours + "h" + minutes + "m";
  } else {
    return `${'\u221e'}`;
  }
}
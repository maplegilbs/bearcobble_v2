//turning compass direction to text direction
export function dirDegToText(degrees) {
    switch (true) {
        case (degrees <= 23 || degrees > 337):
            return 'North';
        case (degrees > 23 && degrees <= 68):
            return 'Northeast';
        case (degrees > 68 && degrees <= 113):
            return 'East';
        case (degrees > 113 && degrees <= 158):
            return 'Southeast';
        case (degrees > 158 && degrees <= 203):
            return 'South';
        case (degrees > 203 && degrees <= 248):
            return 'Southwest';
        case (degrees > 248 && degrees <= 293):
            return 'West';
        case (degrees > 293 && degrees <= 338):
            return 'Northwest';
        default: return 'Direction Unavailable';
    }
}
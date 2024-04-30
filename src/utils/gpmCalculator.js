/* rulerGradiation calculated using an sample ruler with the following properties
Height 416
20 - 18 : 38 = .09135 therefore 1gpm = height * .09135 / 2 = 19 percential .90865 - 1.0000
18 - 16 : 38 = .09135 therefore 1gpm = height * .09135 / 2 = 19 percential .81730 - .90865
16 - 14 : 38 = .09135 therefore 1gpm = height * .09135 / 2 = 19 percential .72595 - .81730
14 - 12 : 40 = .09615 therefore 1gpm = height * .09615 / 2 = 20 percential .62980 - .72595
12 - 10 : 46 = .11058 therefore 1gpm = height * .11058 / 2 = 23 percential .51922 - .62980
10 - 8 : 50 = .12019 therefore 1gpm = height * .12019 / 2 = 25 percential .39905 - .51922
8 - 6 : 54 = .12981 therefore 1gpm = height * .12981 / 2 = 27 percential .26924 - .39905
6 - 4 : 56 = .13462 therefore 1gpm = height * .13462 / 2 = 28 percential .13462 - .26924
4 - 2 : 56 = .13462 therefore 1gpm = height * .13462 / 2 = 28 percential 0 - .13462
*/
const rulerGradiation = [
    { bottomGPM: 2, heightPercent: .13462, bottomPercent: 0, topPercent: .13462 },
    { bottomGPM: 4, heightPercent: .13462, bottomPercent: .13462, topPercent: .26924 },
    { bottomGPM: 6, heightPercent: .12981, bottomPercent: .26924, topPercent: .39905 },
    { bottomGPM: 8, heightPercent: .12019, bottomPercent: .39905, topPercent: .51922 },
    { bottomGPM: 10, heightPercent: .11058, bottomPercent: .51922, topPercent: .62980 },
    { bottomGPM: 12, heightPercent: .09615, bottomPercent: .62980, topPercent: .72595 },
    { bottomGPM: 14, heightPercent: .09135, bottomPercent: .72595, topPercent: .81730 },
    { bottomGPM: 16, heightPercent: .09135, bottomPercent: .81730, topPercent: .90865 },
    { bottomGPM: 18, heightPercent: .09135, bottomPercent: .90865, topPercent: 1.0000 },
]

export function gpmCalc(sightGlassY, sightGlassHeight, floatY, floatHeight) {
    // const rulerShiftPercentage = .2886;
    const rulerShiftPercentage = .278;
    const rulerHeightPercentage = .4045
    let sightGlassAdjustedY = sightGlassY - (sightGlassHeight / 2);
    let floatAdjustedY = floatY - (floatHeight / 2)
    let rulerHeight = sightGlassHeight * rulerHeightPercentage; //good
    let rulerTop = sightGlassHeight * rulerShiftPercentage + sightGlassAdjustedY; //good
    let rulerBottom = rulerTop + rulerHeight;
    if(rulerBottom < floatAdjustedY){ return Number(0).toFixed(2)}
    let floatPercential = Math.abs((floatAdjustedY - rulerBottom) / rulerHeight)
    let percential = rulerGradiation.find(item => floatPercential >= item.bottomPercent && floatPercential < item.topPercent)
    let currentRangeBottomY = rulerBottom - percential.bottomPercent * rulerHeight
    let currentRangeDiffPixels = Math.abs(floatAdjustedY - currentRangeBottomY);
    let currentRangePixelsPerGPM = percential.heightPercent * rulerHeight / 2;
    let gpmAboveCurrentRangeBottom = currentRangeDiffPixels / currentRangePixelsPerGPM;
    let gpm = (Math.round((percential.bottomGPM + gpmAboveCurrentRangeBottom)*4)/4).toFixed(2);
    return gpm;
}
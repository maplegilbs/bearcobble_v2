export function extractSensorData(rawData) {
    let extractedSensorData =
        [
            {
                section1: {
                    section_name: 'Section 1',
                    vacuum_reading: rawData.database.table.row[1].data_EXT.PRESSURE+rawData.database.table.row[1].configuration_EXT.CALIBZERO,
                    reading_time: rawData.database.table.row[1].timeTag_EXT.realtime
                },
                section2: {
                    section_name: 'Section 2',
                    vacuum_reading: rawData.database.table.row[1].data_EXT.PRESSURE2+rawData.database.table.row[1].configuration_EXT.CALIBZERO2,
                    reading_time: rawData.database.table.row[1].timeTag_EXT.realtime
                },
                section3: {
                    section_name: 'Section 3',
                    vacuum_reading: rawData.database.table.row[2].data_EXT.PRESSURE2+rawData.database.table.row[2].configuration_EXT.CALIBZERO2,
                    reading_time: rawData.database.table.row[2].timeTag_EXT.realtime
                },
                section4: {
                    section_name: 'Section 4',
                    vacuum_reading: rawData.database.table.row[3].data_EXT.PRESSURE+rawData.database.table.row[3].configuration_EXT.CALIBZERO,
                    reading_time: rawData.database.table.row[3].timeTag_EXT.realtime
                },
                section5: {
                    section_name: 'Section 5',
                    vacuum_reading: rawData.database.table.row[3].data_EXT.PRESSURE2+rawData.database.table.row[3].configuration_EXT.CALIBZERO2,
                    reading_time: rawData.database.table.row[3].timeTag_EXT.realtime
                },
            },
            {
                tank1: {
                    tank_name: 'Tank 1',
                    tank_level: rawData.database.table.row[4].data_1,
                    reading_time: rawData.database.table.row[4].timeTag_EXT.realtime
                },
                tank2: {
                    tank_name: 'Tank 2',
                    tank_level: rawData.database.table.row[5].data_1,
                    reading_time: rawData.database.table.row[5].timeTag_EXT.realtime
                },
                tank3: {
                    tank_name: 'Tank 3',
                    tank_level: rawData.database.table.row[6].data_1,
                    reading_time: rawData.database.table.row[6].timeTag_EXT.realtime
                },
                tank4: {
                    tank_name: 'Tank 4',
                    tank_level: rawData.database.table.row[7].data_1,
                    reading_time: rawData.database.table.row[7].timeTag_EXT.realtime
                },
                tank5: {
                    tank_name: 'Tank 5',
                    tank_level: rawData.database.table.row[8].data_1,
                    reading_time: rawData.database.table.row[8].timeTag_EXT.realtime
                }
            }
        ];
    return extractedSensorData;
}
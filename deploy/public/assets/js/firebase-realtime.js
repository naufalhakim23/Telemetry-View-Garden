//Database
var databasepush = 'realtime/push';
// Realtime Database Path
var dataRealTimeHumidityPath = 'realtime/set/humidity';
var dataRealTimeTemperaturePath = 'realtime/set/temperature';
var dataRealTimeSoilHumPath = 'realtime/set/soilHum';
var dataRealTimeSoilTempPath = 'realtime/set/soilTemp';
var dataRealTimeCo2ppmPath = 'realtime/set/co2ppmCorrected';
var dataRealTimeTimeStampPath = 'realtime/set/TS';
var dataRealTimeCounterPath = 'realtime/set/z_counter';
var dataRealTimeWaterPumpStatusPath = 'realtime/set/pumpStatus';
var dataRealTimeLightSensPath = 'realtime/set/lightStats';
console.log(dataRealTimeHumidityPath);
// Get a database reference 
const dataRealTimeHumidity = database.ref(dataRealTimeHumidityPath);
const dataRealTimeTemperature = database.ref(dataRealTimeTemperaturePath);
const dataRealTimeSoilHum = database.ref(dataRealTimeSoilHumPath);
const dataRealTimeSoilTemp = database.ref(dataRealTimeSoilTempPath);
const dataRealTimeCo2ppm = database.ref(dataRealTimeCo2ppmPath);
const dataRealTimeTimeStamp = database.ref(dataRealTimeTimeStampPath);
const dataRealTimeCounter = database.ref(dataRealTimeCounterPath);
const dataRealWaterPumpStatus = database.ref(dataRealTimeWaterPumpStatusPath);
const dataRealTimeLightSens = database.ref(dataRealTimeLightSensPath);
console.log(dataRealTimeHumidity);
//Variables to save to current values
var dataRealTimeHumidityReading = [];
var dataRealTimeTemperatureReading = [];
var dataRealTimeSoilHumReading = [];
var dataRealTimeSoilTempReading = [];
var dataRealTimeCo2ppmReading = [];
var dataRealTimeTimeStampReading = [];
var dataRealTimeWaterPumpStatusReading = [];
var dataRealTimeLightSensReading = [];

var updateCount = 0;
var numberElements = 20;

// Attach an asynchronous callback to read the data
dataRealTimeHumidity.on('value', (snapshot) => {
    dataRealTimeHumidityReading = snapshot.val();
    document.getElementById("reading-humid").innerHTML = dataRealTimeHumidityReading;
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});
dataRealTimeTemperature.on('value', (snapshot) => {
    dataRealTimeTemperatureReading = snapshot.val();
    document.getElementById("reading-temp").innerHTML = dataRealTimeTemperatureReading;
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});
dataRealTimeSoilTemp.on('value', (snapshot) => {
    dataRealTimeSoilTempReading = snapshot.val();
    document.getElementById("soil-temp").innerHTML = dataRealTimeSoilTempReading;
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});
dataRealTimeCo2ppm.on('value', (snapshot) => {
    dataRealTimeCo2ppmReading = snapshot.val();
    document.getElementById("reading-co2ppm").innerHTML = dataRealTimeCo2ppmReading;
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});
dataRealTimeSoilHum.on('value', (snapshot) => {
    dataRealTimeSoilHumReading = snapshot.val();
    document.getElementById("soil-hum").innerHTML = dataRealTimeSoilHumReading;
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});

dataRealWaterPumpStatus.on('value', (snapshot) => {
  dataRealTimeWaterPumpStatusReading = snapshot.val();
  document.getElementById("waterpumpStatus").innerHTML = dataRealTimeWaterPumpStatusReading;
}, (errorObject) => {
  console.log('The read failed: ' + errorObject.name);
});

dataRealTimeLightSens.on('value', (snapshot) => {
  dataRealTimeLightSensReading = snapshot.val();
  document.getElementById("lightStatus").innerHTML = dataRealTimeLightSensReading;
}, (errorObject) => {
  console.log('The read failed: ' + errorObject.name);
});
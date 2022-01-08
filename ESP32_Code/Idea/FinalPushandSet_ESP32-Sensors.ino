
#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
// SENSORS
#include <MQ135.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#define DHTPIN 5
#define DHTTYPE DHT22
#define PIN_MQ135 34 //Using ADC1 because ADC2 being use by WiFi
#define oneWireBus 18
#define SensorPin 35 //Using ADC1 because ADC2 being use by WiFi

const int dry = 3618;
const int wet = 1475;
MQ135 mq135_sensor(PIN_MQ135);
DHT dht(DHTPIN, DHTTYPE);
float temperature, humidity; // Temp and Humid floats, will be measured by the DHT
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

//Provide the token generation process info.
#include <addons/TokenHelper.h>

//Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

/* 1. Define the WiFi credentials */
#define WIFI_SSID ""
#define WIFI_PASSWORD ""

//For the following credentials, see examples/Authentications/SignInAsUser/EmailPassword/EmailPassword.ino

/* 2. Define the API Key */
#define API_KEY ""

/* 3. Define the RTDB URL */
#define DATABASE_URL "" 
 //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app

/* 4. Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL ""
#define USER_PASSWORD ""


//Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
unsigned long count = 0;

bool taskCompleted = false;

void setup()
{
  
  Serial.begin(115200);
  Serial.println();
  Serial.println();

  dht.begin();
  sensors.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  //For the following credentials, see examples/Authentications/SignInAsUser/EmailPassword/EmailPassword.ino

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h

  //Or use legacy authenticate method
  //config.database_url = DATABASE_URL;
  //config.signer.tokens.legacy_token = "<database secret>";

  Firebase.begin(&config, &auth);

  Firebase.reconnectWiFi(true);
}

void loop()
{
  //Flash string (PROGMEM and  (FPSTR), String, String C/C++ string, const char, char array, string literal are supported
  //in all Firebase and FirebaseJson functions, unless F() macro is not supported.
  //Sensors
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  //CapacitiveSense Test
  float sensorValue = analogRead(SensorPin);
  float percentageHumidity = map(sensorValue, wet, dry, 100, 0);

  
  //MQ-135 Here
  float rzero = mq135_sensor.getRZero();
  float correctedRZero = mq135_sensor.getCorrectedRZero(temperature, humidity);
  float resistance = mq135_sensor.getResistance();
  float ppm = mq135_sensor.getPPM();
  float correctedPPM = mq135_sensor.getCorrectedPPM(temperature, humidity);
  
  //DS18B20
  sensors.requestTemperatures(); 
  float temperatureSoil = sensors.getTempCByIndex(0);

  if (Firebase.ready() && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0))
  {
    sendDataPrevMillis = millis();

    // Serial.printf("Set timestamp... %s\n", Firebase.RTDB.setTimestamp(&fbdo, "/test/timestamp") ? "ok" : fbdo.errorReason().c_str());
    
    // if (fbdo.httpCode() == FIREBASE_ERROR_HTTP_CODE_OK)
    // {
      
    //   //In setTimestampAsync, the following timestamp will be 0 because the response payload was ignored for all async functions.

    //   //Timestamp saved in millisecond, get its seconds from int value
    //   Serial.print("TIMESTAMP (Seconds): ");
    //   Serial.println(fbdo.to<int>());

    //   //Or print the total milliseconds from double value
    //   //Due to bugs in Serial.print in Arduino library, use printf to print double instead.
    //   printf("TIMESTAMP (milliSeconds): %lld\n", fbdo.to<uint64_t>());
    // }

    //To set and push data with timestamp, requires the JSON data with .sv placeholder
    FirebaseJson json;

    //now we will set the timestamp value at Ts
    json.set("Ts/.sv", "timestamp"); // .sv is the required place holder for sever value which currently supports only string "timestamp" as a value
    json.set("soilTemp/",temperatureSoil);
    json.set("soilHum/", percentageHumidity);
    json.set("humidity/", humidity);
    json.set("temperature/", temperature);
    json.set("co2ppmCorrected/", correctedPPM);
    json.set("co2ppmPureSens/", ppm);
    json.set("z_counter/",count);
    //Set data with timestamp
    Serial.printf("Set data with timestamp... %s\n", Firebase.RTDB.setJSON(&fbdo, "/realtime/set", &json) ? fbdo.to<FirebaseJson>().raw() : fbdo.errorReason().c_str());

    //Push data with timestamp
    Serial.printf("Push data with timestamp... %s\n", Firebase.RTDB.pushJSON(&fbdo, "/realtime/push", &json) ? "ok" : fbdo.errorReason().c_str());
    
    count++;
  }
}

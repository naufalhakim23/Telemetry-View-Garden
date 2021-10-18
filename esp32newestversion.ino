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
#define PIN_MQ135 2
#define oneWireBus 18
#define SensorPin 4

const int dry = 3618;
const int wet = 1475;
MQ135 mq135_sensor(PIN_MQ135);
DHT dht(DHTPIN, DHTTYPE);
float temperature, humidity; // Temp and Humid floats, will be measured by the DHT
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

//


//Provide the token generation process info.
#include <addons/TokenHelper.h>

//Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

/* 1. Define the WiFi credentials */
#define WIFI_SSID "MALUKU 24"
#define WIFI_PASSWORD "2IkanCupang"

//For the following credentials, see examples/Authentications/SignInAsUser/EmailPassword/EmailPassword.ino

/* 2. Define the API Key */
#define API_KEY "AIzaSyBevJHSAmYAcq5I9kTzoNgK1UodyTY9blw"

/* 3. Define the RTDB URL */
#define DATABASE_URL "https://telegarden-5a048-default-rtdb.asia-southeast1.firebasedatabase.app" 
 //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app

/* 4. Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL "isozac@ymail.com"
#define USER_PASSWORD "demaster"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
unsigned long count = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  
  //Sensor Starts
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

  //////////////////////////////////////////////////////////////////////////////////////////////
  //Please make sure the device free Heap is not lower than 80 k for ESP32 and 10 k for ESP8266, 
  //otherwise the SSL connection will fail.
  //////////////////////////////////////////////////////////////////////////////////////////////

  Firebase.begin(&config, &auth);

  //Comment or pass false value when WiFi reconnection will control by your code or third party library
  Firebase.reconnectWiFi(true);

  Firebase.setDoubleDigits(5);
  config.timeout.wifiReconnect = 10 * 1000;
  /** Timeout options, below is default config.
  //WiFi reconnect timeout (interval) in ms (10 sec - 5 min) when WiFi disconnected.
  
  //Socket begin connection timeout (ESP32) or data transfer timeout (ESP8266) in ms (1 sec - 1 min).
  config.timeout.socketConnection = 30 * 1000;
  //ESP32 SSL handshake in ms (1 sec - 2 min). This option doesn't allow in ESP8266 core library.
  config.timeout.sslHandshake = 2 * 60 * 1000;
  //Server response read timeout in ms (1 sec - 1 min).
  config.timeout.serverResponse = 10 * 1000;
  //RTDB Stream keep-alive timeout in ms (20 sec - 2 min) when no server's keep-alive event data received.
  config.timeout.rtdbKeepAlive = 45 * 1000;
  //RTDB Stream reconnect timeout (interval) in ms (1 sec - 1 min) when RTDB Stream closed and want to resume.
  config.timeout.rtdbStreamReconnect = 1 * 1000;
  //RTDB Stream error notification timeout (interval) in ms (3 sec - 30 sec). It determines how often the readStream
  //will return false (error) when it called repeatedly in loop.
  config.timeout.rtdbStreamError = 3 * 1000;
  */

}

void loop() {
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
  float temperatureC = sensors.getTempCByIndex(0);
  // put your main code here, to run repeatedly:
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0))
  {
    sendDataPrevMillis = millis();

    // Serial.printf("Set int... %s\n", Firebase.RTDB.setInt(&fbdo, "/test/int", count) ? "ok" : fbdo.errorReason().c_str());

    Serial.printf("Set int... %s\n", Firebase.RTDB.setInt(&fbdo, "/realtime/z_counter", count) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set float... %s\n", Firebase.RTDB.setFloat(&fbdo, "/realtime/humidity", humidity) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set float... %s\n", Firebase.RTDB.setFloat(&fbdo, "/realtime/temperature", temperature) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set float... %s\n", Firebase.RTDB.setFloat(&fbdo, "/realtime/soilHum", percentageHumidity) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set float... %s\n", Firebase.RTDB.setFloat(&fbdo, "/realtime/soiltemp", temperatureC) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set Int... %s\n", Firebase.RTDB.setInt(&fbdo, "/realtime/co2ppm", correctedPPM) ? "ok" : fbdo.errorReason().c_str());
    
    // Serial.printf("Get double... %s\n", Firebase.RTDB.getDouble(&fbdo, "/test/double") ? String(fbdo.to<double>()).c_str() : fbdo.errorReason().c_str());

    // Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, "/test/string", "Hello World!") ? "ok" : fbdo.errorReason().c_str());

    // Serial.printf("Get string... %s\n", Firebase.RTDB.getString(&fbdo, "/test/string") ? fbdo.to<const char *>() : fbdo.errorReason().c_str());
    Serial.println();

    Serial.printf("Set timestamp... %s\n", Firebase.RTDB.setTimestamp(&fbdo, "/realtime/timestamp") ? "ok" : fbdo.errorReason().c_str());
    
    if (fbdo.httpCode() == FIREBASE_ERROR_HTTP_CODE_OK)
    {
      
      //In setTimestampAsync, the following timestamp will be 0 because the response payload was ignored for all async functions.

      //Timestamp saved in millisecond, get its seconds from int value
      Serial.print("TIMESTAMP (Seconds): ");
      Serial.println(fbdo.to<int>());

      //Or print the total milliseconds from double value
      //Due to bugs in Serial.print in Arduino library, use printf to print double instead.
      printf("TIMESTAMP (milliSeconds): %lld\n", fbdo.to<uint64_t>());
    }

    Serial.printf("Get timestamp... %s\n", Firebase.RTDB.getDouble(&fbdo, "/test/timestamp") ? "ok" : fbdo.errorReason().c_str());
    if (fbdo.httpCode() == FIREBASE_ERROR_HTTP_CODE_OK)
      printf("TIMESTAMP: %lld\n", fbdo.to<uint64_t>());

    //For generic set/get functions.

    //For generic set, use Firebase.RTDB.set(&fbdo, <path>, <any variable or value>)

    //For generic get, use Firebase.RTDB.get(&fbdo, <path>).
    //And check its type with fbdo.dataType() or fbdo.dataTypeEnum() and
    //cast the value from it e.g. fbdo.to<int>(), fbdo.to<std::string>().

    //The function, fbdo.dataType() returns types String e.g. string, boolean,
    //int, float, double, json, array, blob, file and null.

    //The function, fbdo.dataTypeEnum() returns type enum (number) e.g. fb_esp_rtdb_data_type_null (1),
    //fb_esp_rtdb_data_type_integer, fb_esp_rtdb_data_type_float, fb_esp_rtdb_data_type_double,
    //fb_esp_rtdb_data_type_boolean, fb_esp_rtdb_data_type_string, fb_esp_rtdb_data_type_json,
    //fb_esp_rtdb_data_type_array, fb_esp_rtdb_data_type_blob, and fb_esp_rtdb_data_type_file (10)
    count++;
  }
}
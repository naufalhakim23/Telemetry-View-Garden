
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
#define PIN_MQ135 34
#define oneWireBus 18
// int LDR = 32;
int SensorPin = 35;
int relay = 2;

const int dry = 4095;
const int wet = 1601;

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
  pinMode(relay, OUTPUT);
  pinMode(SensorPin, INPUT);
  // pinMode(LDR, INPUT);

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
  config.timeout.rtdbStreamReconnect = 1 * 1000;
  delay(5*60000);
}

void loop()
{
  //Flash string (PROGMEM and  (FPSTR), String, String C/C++ string, const char, char array, string literal are supported
  //in all Firebase and FirebaseJson functions, unless F() macro is not supported.
  //Sensors
  

  //LDR Here
//  float ldr = analogRead(relay);
  

  
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0))
  {
    sendDataPrevMillis = millis();
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    
    //MQ-135 Here
    float rzero = mq135_sensor.getRZero();
    float correctedRZero = mq135_sensor.getCorrectedRZero(temperature, humidity);
    float resistance = mq135_sensor.getResistance();
    float ppm = mq135_sensor.getPPM();
    float correctedPPM = mq135_sensor.getCorrectedPPM(temperature, humidity);
    
    //DS18B20
    sensors.requestTemperatures(); 
    float temperatureSoil = sensors.getTempCByIndex(0);

    //To set and push data with timestamp, requires the JSON data with .sv placeholder
    FirebaseJson json;
    //CapacitiveSense Test
    float sensorValue = analogRead(SensorPin);
    float percentageHumidity = map(sensorValue, wet, dry, 100, 0);
    Serial.print("Moisture : ");
    Serial.print(percentageHumidity);
    Serial.println("%");


    //Pump Logic
    if (percentageHumidity <= 38)
      { digitalWrite(relay, HIGH);
        Serial.println("pump on");
        json.set("pumpStatus/", 1);
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
      delay(1*1000); // on for 10 seconds
      digitalWrite(relay, LOW);
      } 
    else if (percentageHumidity >=39){
      digitalWrite(relay, LOW);
      Serial.println("OFF");
        json.set("pumpStatus/", 0);
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
      
      }
    
    count++;
  }
  delay(14000);
}
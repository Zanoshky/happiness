#include <ArduinoJson.h>
#include <SoftwareSerial.h>
#include <Wire.h>
#include <DHT.h>
#include <math.h>
#include <BH1750.h>
#include <Adafruit_BME280.h>

/*
 * Happiness IoT Sensor Station
 * Reads environment data and POSTs to the Happiness API.
 */

// --- Pin definitions ---
#define PIN_D_TEMP_N_HUM 2
#define BME_SCK 13
#define BME_MISO 12
#define BME_MOSI 11
#define BME_CS 10
#define PIN_A_GAS 0
#define PIN_A_VOLUME A2

#define TEAM_NAME "Heisenberg"
#define DHTTYPE DHT22

// --- Configuration (edit these) ---
String AP = "";       // WiFi SSID
String PASS = "";     // WiFi password
String HOST = "";     // API host, e.g. "192.168.1.100"
String PORT = "3030"; // API port
int idHomebase = 1;

// --- Sensor variables ---
float humidityValue;
float temperatureValue;
float dustValue;
long soundMeter;
float digitalTemp;
float digitalHumidity;
float digitalPressure;

int pinDust = 8;
unsigned long duration;
unsigned long starttime;
unsigned long sampletime_ms = 1000;
unsigned long lowpulseoccupancy = 0;
float ratio = 0;
float concentration = 0;

int smokeAnalogSensor = A0;
int sensorThres = 400;

const byte rxPin = 4;
const byte txPin = 5;

int countTrueCommand;
int countTimeCommand;
boolean found = false;

// --- Peripherals ---
SoftwareSerial ESP8266(rxPin, txPin);
DHT dht(PIN_D_TEMP_N_HUM, DHTTYPE);
BH1750 lightMeter;
Adafruit_BME280 bme(BME_CS, BME_MOSI, BME_MISO, BME_SCK);

void setup()
{
  Serial.begin(9600);
  ESP8266.begin(9600);
  dht.begin();
  lightMeter.begin();

  Serial.print("Starting Codename Happiness for ");
  Serial.println(TEAM_NAME);

  pinMode(pinDust, INPUT);
  starttime = millis();
  pinMode(smokeAnalogSensor, INPUT);

  if (!bme.begin())
  {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
  }

  sendCommand("AT", 5, "OK");
  sendCommand("AT+CWMODE=1", 5, "OK");
  sendCommand("AT+CWJAP=\"" + AP + "\",\"" + PASS + "\"", 20, "OK");
}

void sendCommand(String command, int maxTime, char readReplay[])
{
  Serial.print(countTrueCommand);
  Serial.print(". at command => ");
  Serial.print(command);
  Serial.print(" ");

  while (countTimeCommand < (maxTime * 1))
  {
    ESP8266.println(command);
    if (ESP8266.find(readReplay))
    {
      found = true;
      break;
    }
    countTimeCommand++;
  }

  if (found == true)
  {
    Serial.println("OK");
    countTrueCommand++;
    countTimeCommand = 0;
  }
  else
  {
    Serial.println("FAIL");
    countTrueCommand = 0;
    countTimeCommand = 0;
  }

  found = false;
}

// --- Sensor readers ---

float readHumidityDH11()
{
  humidityValue = dht.readHumidity();
  return float(humidityValue);
}

float readTemperatureDH11()
{
  temperatureValue = dht.readTemperature();
  return float(temperatureValue);
}

float readDigitalTemperature()
{
  return float(bme.readTemperature());
}

float readDigitalHumidity()
{
  return float(bme.readHumidity());
}

float readDigitalPressure()
{
  return float(bme.readPressure());
}

float gasDetection()
{
  return float(analogRead(smokeAnalogSensor));
}

float soundLevelDetection()
{
  soundMeter = 0;
  for (byte i = 0; i < 32; i++)
  {
    soundMeter += analogRead(PIN_A_VOLUME);
  }
  soundMeter >>= 5;
  soundMeter = 20 * log10(analogRead(soundMeter));
  return float(soundMeter);
}

float lightIntensity()
{
  return float(lightMeter.readLightLevel());
}

float dustLevelDetection()
{
  duration = pulseIn(pinDust, LOW);
  lowpulseoccupancy = lowpulseoccupancy + duration;
  if ((millis() - starttime) >= sampletime_ms)
  {
    ratio = lowpulseoccupancy / (sampletime_ms * 10.0);
    concentration = 1.1 * pow(ratio, 3) - 3.8 * pow(ratio, 2) + 520 * ratio + 0.62;
    lowpulseoccupancy = 0;
    starttime = millis();
    return float(concentration);
  }
  return 0;
}

// --- Main loop ---

void loop()
{
  StaticJsonDocument<200> doc;
  doc["homebase_id"] = idHomebase;
  doc["temperature"] = readTemperatureDH11();
  doc["humidity"] = readHumidityDH11();
  doc["dust"] = dustLevelDetection();
  doc["gas"] = gasDetection();
  doc["volume"] = soundLevelDetection();
  doc["light"] = lightIntensity();
  doc["pressure"] = readDigitalPressure();

  char body[200];
  int bodyLen = serializeJson(doc, body);

  Serial.println(body);

  // POST /api/measurements
  String postRequest =
      "POST /api/measurements HTTP/1.1\r\n"
      "Host: " +
      HOST + ":" + PORT + "\r\n" +
      "Content-Type: application/json\r\n" +
      "Content-Length: " + String(bodyLen) + "\r\n" +
      "\r\n" + String(body);

  sendCommand("AT+CIPMUX=1", 5, "OK");
  sendCommand("AT+CIPSTART=0,\"TCP\",\"" + HOST + "\"," + PORT, 15, "OK");
  sendCommand("AT+CIPSEND=0," + String(postRequest.length() + 4), 4, ">");

  ESP8266.println(postRequest);
  delay(1500);
  countTrueCommand++;

  if (ESP8266.find("SEND OK"))
  {
    Serial.println("Measurement sent");
  }

  sendCommand("AT+CIPCLOSE=0", 5, "OK");

  delay(5000); // Read every 5 seconds
}

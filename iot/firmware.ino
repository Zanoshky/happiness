/*
 * ╔═══════════════════════════════════════════════════════╗
 * ║          Happiness — IoT Sensor Station               ║
 * ║                                                       ║
 * ║  Reads office environment data from 6 sensors and     ║
 * ║  POSTs JSON to the Happiness API every N seconds.     ║
 * ╚═══════════════════════════════════════════════════════╝
 *
 * Board:    Arduino Uno / Nano
 * WiFi:     ESP8266 (AT firmware) via SoftwareSerial
 * Protocol: HTTP POST → /api/measurements
 */

#include <ArduinoJson.h>
#include <SoftwareSerial.h>
#include <Wire.h>
#include <DHT.h>
#include <math.h>
#include <BH1750.h>
#include <Adafruit_BME280.h>

// ─────────────────────────────────────────────────────────
//  PIN DEFINITIONS
// ─────────────────────────────────────────────────────────
//
//  Arduino Uno/Nano pinout:
//
//        ┌──────────────────┐
//   D0   │ TX           VIN │
//   D1   │ RX           GND │
//   D2 ──│ DHT22 DATA   RST │
//   D3   │              5V  │
//   D4 ──│ ESP RX       A7  │
//   D5 ──│ ESP TX       A6  │
//   D6   │              A5 ─│── BH1750 SCL / BME280 SCL
//   D7   │              A4 ─│── BH1750 SDA / BME280 SDA
//   D8 ──│ DUST SENSOR  A3  │
//   D9   │              A2 ─│── MIC (analog)
//   D10──│ BME CS       A1  │
//   D11──│ BME MOSI     A0 ─│── MQ GAS (analog)
//   D12──│ BME MISO    AREF │
//   D13──│ BME SCK      GND │
//        └──────────────────┘

#define PIN_DHT         2       // DHT22 data pin
#define PIN_ESP_RX      4       // Wire to ESP8266 TX
#define PIN_ESP_TX      5       // Wire to ESP8266 RX
#define PIN_DUST        8       // Dust sensor digital
#define PIN_BME_CS      10      // BME280 SPI chip select
#define PIN_BME_MOSI    11      // BME280 SPI MOSI
#define PIN_BME_MISO    12      // BME280 SPI MISO
#define PIN_BME_SCK     13      // BME280 SPI clock
#define PIN_GAS         A0      // MQ gas sensor analog
#define PIN_MIC         A2      // Microphone analog

#define DHTTYPE         DHT22
#define TEAM_NAME       "Heisenberg"

// ─────────────────────────────────────────────────────────
//  CONFIGURATION — edit these for your setup
// ─────────────────────────────────────────────────────────

const char* WIFI_SSID = "";          // Your WiFi network name
const char* WIFI_PASS = "";          // Your WiFi password
const char* API_HOST  = "";          // API server IP, e.g. "192.168.1.42"
const int   API_PORT  = 3030;        // API server port
const int   HOMEBASE_ID = 1;         // Which homebase this station belongs to
const unsigned long READ_INTERVAL_MS = 5000;  // How often to read & send (ms)

// ─────────────────────────────────────────────────────────
//  PERIPHERALS
// ─────────────────────────────────────────────────────────

SoftwareSerial esp(PIN_ESP_RX, PIN_ESP_TX);
DHT dht(PIN_DHT, DHTTYPE);
BH1750 lightMeter;
Adafruit_BME280 bme(PIN_BME_CS, PIN_BME_MOSI, PIN_BME_MISO, PIN_BME_SCK);

// ─────────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────────

// Dust sensor sampling
unsigned long dustSampleStart = 0;
unsigned long dustLowPulse = 0;
const unsigned long DUST_SAMPLE_MS = 1000;

// Sound averaging
const int SOUND_SAMPLES = 32;

// ESP8266 AT command tracking
int cmdSuccessCount = 0;
bool wifiConnected = false;

// ─────────────────────────────────────────────────────────
//  SETUP
// ─────────────────────────────────────────────────────────

void setup()
{
  Serial.begin(9600);
  esp.begin(9600);

  Serial.println(F(""));
  Serial.println(F("╔═══════════════════════════════════╗"));
  Serial.println(F("║   Happiness Sensor Station v2.0   ║"));
  Serial.println(F("╚═══════════════════════════════════╝"));
  Serial.print(F("Team: "));
  Serial.println(TEAM_NAME);
  Serial.println(F(""));

  // Init sensors
  dht.begin();
  Serial.println(F("[OK] DHT22 initialized"));

  if (lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE))
    Serial.println(F("[OK] BH1750 light sensor initialized"));
  else
    Serial.println(F("[!!] BH1750 not found — check I2C wiring"));

  if (bme.begin())
    Serial.println(F("[OK] BME280 initialized"));
  else
    Serial.println(F("[!!] BME280 not found — check SPI wiring"));

  pinMode(PIN_DUST, INPUT);
  pinMode(PIN_GAS, INPUT);
  pinMode(PIN_MIC, INPUT);
  dustSampleStart = millis();

  Serial.println(F("[OK] Analog sensors ready"));
  Serial.println(F(""));

  // Connect WiFi
  Serial.println(F("Connecting to WiFi..."));
  wifiConnected = sendAT("AT", 5, "OK");
  sendAT("AT+CWMODE=1", 5, "OK");

  String joinCmd = "AT+CWJAP=\"";
  joinCmd += WIFI_SSID;
  joinCmd += "\",\"";
  joinCmd += WIFI_PASS;
  joinCmd += "\"";
  wifiConnected = sendAT(joinCmd, 20, "OK");

  if (wifiConnected)
    Serial.println(F("[OK] WiFi connected"));
  else
    Serial.println(F("[!!] WiFi connection failed — will retry on send"));

  Serial.println(F(""));
  Serial.println(F("Starting sensor loop..."));
  Serial.println(F("─────────────────────────────────────"));
}

// ─────────────────────────────────────────────────────────
//  AT COMMAND HELPER
// ─────────────────────────────────────────────────────────

bool sendAT(String command, int timeoutSec, const char* expected)
{
  Serial.print(F("  AT> "));
  Serial.print(command.substring(0, 40)); // Truncate passwords in log

  for (int attempt = 0; attempt < timeoutSec; attempt++)
  {
    esp.println(command);
    if (esp.find((char*)expected))
    {
      Serial.println(F(" ✓"));
      cmdSuccessCount++;
      return true;
    }
  }

  Serial.println(F(" ✗"));
  return false;
}

// ─────────────────────────────────────────────────────────
//  SENSOR READERS
// ─────────────────────────────────────────────────────────

float readTemperature()
{
  float val = dht.readTemperature();
  if (isnan(val))
  {
    Serial.println(F("  [warn] DHT22 temp read failed, using BME280"));
    return bme.readTemperature();
  }
  return val;
}

float readHumidity()
{
  float val = dht.readHumidity();
  if (isnan(val))
  {
    Serial.println(F("  [warn] DHT22 humidity read failed, using BME280"));
    return bme.readHumidity();
  }
  return val;
}

float readPressure()
{
  // BME280 returns Pa, convert to hPa
  return bme.readPressure() / 100.0F;
}

float readLight()
{
  float lux = lightMeter.readLightLevel();
  // BH1750 returns -1 or -2 on error
  return (lux < 0) ? 0.0 : lux;
}

float readGas()
{
  return (float)analogRead(PIN_GAS);
}

float readVolume()
{
  // Average multiple samples for stability
  long total = 0;
  for (int i = 0; i < SOUND_SAMPLES; i++)
  {
    total += analogRead(PIN_MIC);
  }
  float avg = (float)total / SOUND_SAMPLES;

  // Convert to approximate dB (rough analog mic calibration)
  if (avg <= 0) return 0;
  return 20.0 * log10(avg);
}

float readDust()
{
  unsigned long dur = pulseIn(PIN_DUST, LOW, 100000); // 100ms timeout
  dustLowPulse += dur;

  if ((millis() - dustSampleStart) >= DUST_SAMPLE_MS)
  {
    float ratio = dustLowPulse / (DUST_SAMPLE_MS * 10.0);
    float conc = 1.1 * pow(ratio, 3) - 3.8 * pow(ratio, 2) + 520 * ratio + 0.62;
    dustLowPulse = 0;
    dustSampleStart = millis();
    return max(conc, 0.0f); // Never return negative
  }
  return -1; // Sample not ready yet
}

// ─────────────────────────────────────────────────────────
//  HTTP POST
// ─────────────────────────────────────────────────────────

bool postMeasurement(const char* json, int len)
{
  String host = API_HOST;
  String port = String(API_PORT);

  // Open TCP connection
  if (!sendAT("AT+CIPMUX=1", 5, "OK")) return false;
  if (!sendAT("AT+CIPSTART=0,\"TCP\",\"" + host + "\"," + port, 15, "OK")) return false;

  // Build HTTP request
  String req = "POST /api/measurements HTTP/1.1\r\n";
  req += "Host: " + host + ":" + port + "\r\n";
  req += "Content-Type: application/json\r\n";
  req += "Content-Length: " + String(len) + "\r\n";
  req += "Connection: close\r\n";
  req += "\r\n";
  req += json;

  // Send
  if (!sendAT("AT+CIPSEND=0," + String(req.length()), 4, ">")) return false;

  esp.print(req);
  delay(1500);

  bool sent = esp.find("SEND OK");
  sendAT("AT+CIPCLOSE=0", 5, "OK");

  return sent;
}

// ─────────────────────────────────────────────────────────
//  MAIN LOOP
// ─────────────────────────────────────────────────────────

void loop()
{
  // Read all sensors
  float temp     = readTemperature();
  float humidity  = readHumidity();
  float dust     = readDust();
  float gas      = readGas();
  float volume   = readVolume();
  float light    = readLight();
  float pressure = readPressure();

  // Skip if dust sample isn't ready
  if (dust < 0) dust = 0;

  // Build JSON payload
  StaticJsonDocument<256> doc;
  doc["homebase_id"] = HOMEBASE_ID;
  doc["temperature"] = round(temp * 10) / 10.0;
  doc["humidity"]    = round(humidity * 10) / 10.0;
  doc["dust"]        = round(dust * 10) / 10.0;
  doc["gas"]         = round(gas * 10) / 10.0;
  doc["volume"]      = round(volume * 10) / 10.0;
  doc["light"]       = round(light * 10) / 10.0;
  doc["pressure"]    = round(pressure * 10) / 10.0;

  char body[256];
  int bodyLen = serializeJson(doc, body, sizeof(body));

  // Log to serial
  Serial.println(F(""));
  Serial.print(F("🌡 "));  Serial.print(temp, 1);     Serial.print(F("°C  "));
  Serial.print(F("💧 "));  Serial.print(humidity, 1);  Serial.print(F("%  "));
  Serial.print(F("☀ "));   Serial.print(light, 0);     Serial.print(F("lux  "));
  Serial.print(F("🔊 "));  Serial.print(volume, 1);    Serial.print(F("dB  "));
  Serial.print(F("🌫 "));  Serial.print(dust, 0);      Serial.print(F("µg  "));
  Serial.print(F("🔥 "));  Serial.print(gas, 0);       Serial.print(F("ppm  "));
  Serial.print(F("⏲ "));   Serial.print(pressure, 1);  Serial.println(F("hPa"));

  // Send to API
  if (postMeasurement(body, bodyLen))
    Serial.println(F("  → Sent ✓"));
  else
    Serial.println(F("  → Send failed ✗ (will retry next cycle)"));

  delay(READ_INTERVAL_MS);
}

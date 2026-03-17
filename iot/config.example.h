/*
 * Happiness IoT — Configuration Template
 *
 * Copy this file to the firmware.ino configuration section,
 * or just edit the values directly in firmware.ino.
 */

const char* WIFI_SSID = "YourWiFiName";     // WiFi network name
const char* WIFI_PASS = "YourWiFiPassword";  // WiFi password
const char* API_HOST  = "192.168.1.42";      // IP of the machine running `npm run api`
const int   API_PORT  = 3030;                // API port (default 3030)
const int   HOMEBASE_ID = 1;                 // Homebase ID (create one via API first)
const unsigned long READ_INTERVAL_MS = 5000; // Sensor read interval in milliseconds

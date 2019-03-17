# Happiness IoT Firmware

Arduino firmware for the office environment sensor station.

## Sensors
- DHT22 — Temperature & Humidity
- BME280 — Digital Temperature, Humidity, Pressure
- BH1750 — Light intensity (lux)
- MQ gas sensor — Gas/smoke detection
- Dust sensor — Particulate matter
- Analog mic — Sound level (volume)

## Wiring
See pin definitions in `firmware.ino`.

## Libraries
Install via Arduino Library Manager:
- ArduinoJson (v6)
- DHT sensor library
- BH1750
- Adafruit BME280 Library
- Adafruit Unified Sensor

## Configuration
Edit `firmware.ino` and set:
- `AP` — WiFi SSID
- `PASS` — WiFi password
- `HOST` — API server address (e.g. `http://192.168.1.100`)
- `PORT` — API port (default `3030`)
- `idHomebase` — Homebase ID to post measurements to

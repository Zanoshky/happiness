<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/smiling-face-with-open-hands_1f917.png" width="80" />
</p>

<h1 align="center">Happiness</h1>

<p align="center">
  <strong>Office environment monitoring that puts wellbeing first.</strong><br/>
  Real-time IoT sensors → beautiful dashboard → happier humans.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/react-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/express-4.21-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/sqlite-WAL-003B57?style=flat-square&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/arduino-ESP8266-00878F?style=flat-square&logo=arduino&logoColor=white" />
  <img src="https://img.shields.io/badge/license-GPL--3.0-blue?style=flat-square" />
</p>

---

## What is this?

Happiness measures the invisible things that affect how you feel at work — temperature, humidity, air quality, noise, light — and distills them into a single **Happiness Score**.

An Arduino sensor station collects environment data every 5 seconds and streams it to a lightweight API. A fast, dark-themed dashboard visualizes everything in real time.

## Preview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🟢 Happiness          │                                                    │
│                         │   Dashboard                                       │
│  ▸ Dashboard            │   Office environment at a glance                  │
│                         │                                                    │
│  HOMEBASES              │   ┌──────────────────────────────────────────┐     │
│  ▸ Prototype — Live     │   │                                          │     │
│  ▸ Prototype — History  │   │            ╭──────────────╮              │     │
│                         │   │           ╱    ╭──────╮    ╲             │     │
│                         │   │          │    │  78%  │    │             │     │
│                         │   │          │    │HAPPY  │    │             │     │
│                         │   │           ╲    ╰──────╯    ╱             │     │
│                         │   │            ╰──────────────╯              │     │
│                         │   │                                          │     │
│                         │   │     Last reading: 3/17/2026, 9:42 PM     │     │
│                         │   └──────────────────────────────────────────┘     │
│                         │                                                    │
│                         │   ┌──────────────────────────────────────────┐     │
│                         │   │  🏠 Prototype                        →  │     │
│                         │   │     Live sensor readings                 │     │
│                         │   └──────────────────────────────────────────┘     │
│                         │                                                    │
│  v2.0.0                │                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🟢 Happiness          │                                                    │
│                         │   Homebase #1                    📜 View History  │
│  ▸ Dashboard            │   Live — updated 9:42:15 PM                       │
│                         │                                                    │
│  HOMEBASES              │              ╭──────────────╮                      │
│  ▸ Prototype — Live     │             ╱    ╭──────╮    ╲                     │
│  ▸ Prototype — History  │            │    │  78%  │    │                     │
│                         │            │    │HAPPY  │    │                     │
│                         │             ╲    ╰──────╯    ╱                     │
│                         │              ╰──────────────╯                      │
│                         │                                                    │
│                         │   ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│                         │   │ 🌡 Temp    │ │ 💧 Humid   │ │ 🌫 Dust    │    │
│                         │   │   23.4 °C  │ │   52.1 %   │ │  142.3µg/m³│    │
│                         │   └────────────┘ └────────────┘ └────────────┘    │
│                         │   ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│                         │   │ 🔥 Gas     │ │ 🔊 Volume  │ │ ☀️ Light   │    │
│                         │   │  312.0 ppm │ │   45.2 dB  │ │  487.0 lux │    │
│                         │   └────────────┘ └────────────┘ └────────────┘    │
│  v2.0.0                │   ┌────────────┐                                   │
│                         │   │ ⏲ Pressure │                                   │
│                         │   │  1013.2hPa │                                   │
│                         │   └────────────┘                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🟢 Happiness          │                                                    │
│                         │   ← Homebase #1 — History                         │
│  ▸ Dashboard            │   Last 50 readings                                │
│                         │                                                    │
│  HOMEBASES              │   Happiness Score                                  │
│  ▸ Prototype — Live     │   ┌──────────────────────────────────────────┐    │
│  ▸ Prototype — History  │   │  100┤                                    │    │
│                         │   │     │    ╱╲    ╱╲                        │    │
│                         │   │   75┤   ╱  ╲╱╱  ╲   ╱╲  ╱╲             │    │
│                         │   │     │  ╱         ╲ ╱  ╲╱  ╲╱╲          │    │
│                         │   │   50┤╱            ╲        ╲  ╲         │    │
│                         │   │     │                           ╲        │    │
│                         │   │   25┤                                    │    │
│                         │   │    0┤────────────────────────────────    │    │
│                         │   └──────────────────────────────────────────┘    │
│                         │                                                    │
│                         │   Temperature (°C)          Humidity (%)           │
│                         │   ┌───────────────────┐    ┌───────────────────┐  │
│                         │   │  ╱╲  ╱╲  ╱╲      │    │     ╱╲            │  │
│                         │   │ ╱  ╲╱  ╲╱  ╲╱╲   │    │ ╱╲╱  ╲╱╲  ╱╲    │  │
│                         │   │╱            ╲  ╲  │    │╱       ╲╱  ╲╱   │  │
│                         │   └───────────────────┘    └───────────────────┘  │
│  v2.0.0                │                                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```


## Architecture

```
                    ┌─────────────┐
                    │   Arduino   │
                    │  + ESP8266  │
                    │             │
                    │  DHT22      │
                    │  BME280     │
                    │  BH1750     │     POST /api/measurements
                    │  MQ Gas     │ ─────────────────────────────┐
                    │  Dust       │                               │
                    │  Mic        │                               ▼
                    └─────────────┘                    ┌──────────────────┐
                                                       │   Express API    │
                                                       │   port 3030      │
                    ┌─────────────┐                    │                  │
                    │   Browser   │  GET /api/status   │   SQLite (WAL)   │
                    │             │ ◄─────────────────│                  │
                    │  Vite       │                    └──────────────────┘
                    │  React 18   │
                    │  Tailwind   │
                    │  Recharts   │
                    │             │
                    └─────────────┘
```

## Sensors & Scoring

Each sensor maps to a 0–100 sub-score based on ideal office ranges. The overall **Happiness Score** is the average.

| Sensor | Ideal Range | Scoring |
|---|---|---|
| 🌡 Temperature | 20–24 °C | 100 in range, degrades outside |
| 💧 Humidity | 40–60 % | 100 in range, degrades outside |
| 🌫 Dust | < 50 µg/m³ | 100 if low, drops with concentration |
| 🔥 Gas | < 200 ppm | 100 if low, drops with concentration |
| 🔊 Volume | < 50 dB | 100 if quiet, drops with noise |
| ☀️ Light | 300–500 lux | 100 in range, degrades outside |

## Quick Start

```bash
# 1. Install
cd happiness
npm install

# 2. Seed demo data
npm run api:seed

# 3. Start API (terminal 1)
npm run api
# 🟢 Happiness API running on http://localhost:3030

# 4. Start frontend (terminal 2)
npm run dev
# ➜ Local: http://localhost:5173
```

Open [localhost:5173](http://localhost:5173) and you're in.

## Project Structure

```
happiness/
├── api/                  # Express + SQLite backend
│   ├── db.ts             # Database schema & connection
│   ├── happiness.ts      # Scoring algorithm
│   ├── seed.ts           # Demo data generator
│   └── server.ts         # REST endpoints
├── iot/                  # Arduino firmware
│   ├── firmware.ino      # Sensor reading + WiFi POST
│   └── README.md         # Wiring & setup guide
├── src/                  # Vite + React frontend
│   ├── components/       # HappinessRing, SensorCard, SensorChart, Sidebar
│   ├── hooks/            # usePolling (auto-refresh)
│   ├── pages/            # Dashboard, HomebaseLive, HomebaseHistory
│   ├── api.ts            # API client
│   └── types.ts          # TypeScript interfaces
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── Dockerfile
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/homebases` | List all homebases |
| `GET` | `/api/homebases/:id` | Get a homebase |
| `POST` | `/api/homebases` | Create a homebase |
| `POST` | `/api/measurements` | Submit a measurement (JSON) |
| `GET` | `/api/measurements/:homebaseId` | Get measurements |
| `GET` | `/api/status/:homebaseId` | Measurements + happiness score |
| `GET` | `/api/status/:homebaseId/latest` | Latest reading + score |
| `GET` | `/api/measurements/:id/:h/:t/:d/:g/:p/:v/:l` | IoT compat (GET-based insert) |

## IoT Setup

The Arduino firmware in `iot/firmware.ino` reads from 6 sensors and POSTs JSON to the API every 5 seconds.

Edit these lines in the firmware:
```cpp
String AP = "YourWiFi";
String PASS = "YourPassword";
String HOST = "192.168.1.100";
String PORT = "3030";
int idHomebase = 1;
```

See [`iot/README.md`](iot/README.md) for full wiring and library details.

## Docker

```bash
docker build -t happiness .
docker run -p 3030:3030 happiness
```

The production build serves the Vite frontend as static files from the Express API.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vite 6, React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons |
| Backend | Express 4, better-sqlite3 (WAL mode), TypeScript |
| IoT | Arduino, ESP8266, DHT22, BME280, BH1750, MQ gas sensor |
| Infra | Docker, nginx-ready |

## History

This project started as three separate repos:

- `happiness-api` — LoopBack 4 REST API (Node 8 era)
- `happiness-web` — React 16 + Create React App + Ant Design 3
- `happiness-iot` — Arduino sketch

They've been unified into a single modern codebase with a real happiness scoring algorithm (the old one was `Math.random()` 😅).

## License

[GPL-3.0](LICENSE) — Marko Zanoski & Brendan Mullins

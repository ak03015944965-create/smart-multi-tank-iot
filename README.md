# Smart Multi-Tank Water Monitoring & Automatic Pump Control System

An ESP32-based IoT system designed to monitor water levels in multiple tanks and automatically control pumps based on the detected water level.

## 🚀 Project Overview

This project uses an ESP32 and three ultrasonic sensors to monitor the water level of three separate tanks.

The system calculates the water level as a percentage, automatically controls the corresponding pumps when the tank level becomes low, and activates visual and audible alarms when required.

The system also sends real-time telemetry using MQTT to a ThingsBoard IoT platform.

The complete system is simulated using Wokwi.
## 🖥️ Dashboard Preview

![Smart Multi-Tank IoT Dashboard](smart-multi-tank-dashboard.png)

## 🌐 Live Demo

[Open Smart Multi-Tank IoT Dashboard](https://ak03015944965-create.github.io/smart-multi-tank-iot/)

## ✨ Features

- Real-time monitoring of three water tanks
- Three HC-SR04 ultrasonic sensors
- Water-level calculation in percentage
- Automatic pump control
- Individual relay control for each pump
- Low-level alarm system
- Red and green status indicators
- Buzzer alarm
- Sensor averaging for more stable measurements
- ESP32-based control system
- MQTT telemetry
- ThingsBoard IoT monitoring
- Wokwi simulation

## 🛠️ Technologies Used

- ESP32
- C++
- Arduino Framework
- HC-SR04 Ultrasonic Sensors
- Relay Modules
- LEDs
- Buzzer
- MQTT
- ThingsBoard
- Wokwi

## 🔌 ESP32 Pin Configuration

| ESP32 GPIO | Function |
|---|---|
| GPIO 5 | Tank 1 Trigger |
| GPIO 18 | Tank 1 Echo |
| GPIO 13 | Tank 2 Trigger |
| GPIO 27 | Tank 2 Echo |
| GPIO 14 | Tank 3 Trigger |
| GPIO 26 | Tank 3 Echo |
| GPIO 16 | Pump 1 Relay |
| GPIO 17 | Pump 2 Relay |
| GPIO 19 | Pump 3 Relay |
| GPIO 4 | Red LED |
| GPIO 2 | Green LED |
| GPIO 15 | Buzzer |

## ⚙️ How It Works

Each HC-SR04 ultrasonic sensor measures the distance between the sensor and the water surface.

The ESP32 processes the measurements and converts the detected distance into a tank-level percentage.

Five sensor readings are averaged to reduce measurement fluctuations.

When a tank level falls below the configured threshold, the corresponding pump relay is activated.

The system also activates the alarm indicators when a low-level condition is detected.

The ESP32 then publishes the tank levels, pump states, and alarm status through MQTT telemetry.

## 📡 IoT Monitoring

The ESP32 communicates with an IoT platform using MQTT.

The following telemetry values are transmitted:

- Tank 1 level
- Tank 2 level
- Tank 3 level
- Pump 1 state
- Pump 2 state
- Pump 3 state
- Alarm state

ThingsBoard can be used to visualize and monitor this telemetry remotely.

## 🧪 Simulation

The project was developed and tested using Wokwi.

### Wokwi Simulation

[Open the Wokwi Simulation](https://wokwi.com/projects/467271011368198145)

## 📊 System Architecture

```text
             ┌──────────────────────┐
             │        ESP32         │
             │                      │
             │   Control + IoT      │
             └──────────┬───────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   HC-SR04 #1      HC-SR04 #2      HC-SR04 #3
        │               │               │
        ▼               ▼               ▼
     Tank 1          Tank 2          Tank 3
        │               │               │
        ▼               ▼               ▼
    Pump Relay 1    Pump Relay 2    Pump Relay 3

                        │
                        ▼
                  MQTT Telemetry
                        │
                        ▼
                   ThingsBoard

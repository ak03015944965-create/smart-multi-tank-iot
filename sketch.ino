#include <WiFi.h>
#include <PubSubClient.h>

// ================= WIFI =================
const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";

// ================= THINGSBOARD =================
const char* THINGSBOARD_SERVER = "thingsboard.cloud";
const int THINGSBOARD_PORT = 1883;
const char TOKEN[] = "YOUR_THINGSBOARD_TOKEN";

// ================= PINS =================
// Tank 1
#define TRIG1 5
#define ECHO1 18

// Tank 2
#define TRIG2 13
#define ECHO2 27

// Tank 3
#define TRIG3 14
#define ECHO3 26

// Relays
#define RELAY1 16
#define RELAY2 17
#define RELAY3 19

// Indicators
#define RED_LED 4
#define GREEN_LED 2
#define BUZZER 15

// ================= OBJECTS =================
WiFiClient espClient;
PubSubClient client(espClient);

// Sensor range (IMPORTANT FIX)
const float MAX_RANGE = 400.0;

// ================= WIFI CONNECT =================
void connectWiFi() {
  Serial.print("Connecting WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
}

// ================= THINGSBOARD CONNECT =================
void reconnectTB() {
  while (!client.connected()) {
    Serial.print("Connecting ThingsBoard...");
    if (client.connect("ESP32", TOKEN, NULL)) {
      Serial.println("Connected!");
    } else {
      Serial.println("Failed, retrying...");
      delay(1000);
    }
  }
}

// ================= READ SINGLE SENSOR =================
float readRaw(int trig, int echo) {

  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  long duration = pulseIn(echo, HIGH, 30000);

  if (duration == 0) return -1;

  float distance = duration * 0.0343 / 2;
  return distance;
}

// ================= STABLE SENSOR (AVERAGE) =================
float readStable(int trig, int echo) {

  float sum = 0;
  int count = 0;

  for (int i = 0; i < 5; i++) {
    float d = readRaw(trig, echo);

    if (d > 0) {
      sum += d;
      count++;
    }

    delay(30);
  }

  if (count == 0) return MAX_RANGE;

  return sum / count;
}

// ================= CONVERT TO % (FIXED FOR 400CM RANGE) =================
float getLevel(float distance) {

  if (distance < 0) distance = MAX_RANGE;
  if (distance > MAX_RANGE) distance = MAX_RANGE;

  float level = (1.0 - (distance / MAX_RANGE)) * 100.0;

  if (level < 0) level = 0;
  if (level > 100) level = 100;

  return level;
}

// ================= SETUP =================
void setup() {

  Serial.begin(115200);

  pinMode(TRIG1, OUTPUT);
  pinMode(ECHO1, INPUT);

  pinMode(TRIG2, OUTPUT);
  pinMode(ECHO2, INPUT);

  pinMode(TRIG3, OUTPUT);
  pinMode(ECHO3, INPUT);

  pinMode(RELAY1, OUTPUT);
  pinMode(RELAY2, OUTPUT);
  pinMode(RELAY3, OUTPUT);

  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  digitalWrite(RELAY1, LOW);
  digitalWrite(RELAY2, LOW);
  digitalWrite(RELAY3, LOW);

  connectWiFi();
  client.setServer(THINGSBOARD_SERVER, THINGSBOARD_PORT);
}

// ================= LOOP =================
void loop() {

  if (!client.connected()) {
    reconnectTB();
  }

  client.loop();

  // Read sensors (with delay to avoid interference)
  float d1 = readStable(TRIG1, ECHO1);
  delay(60);
  float d2 = readStable(TRIG2, ECHO2);
  delay(60);
  float d3 = readStable(TRIG3, ECHO3);

  // Convert to percentage
  float tank1 = getLevel(d1);
  float tank2 = getLevel(d2);
  float tank3 = getLevel(d3);

  // Alarm logic
  bool alarm = false;

  if (tank1 < 20) { digitalWrite(RELAY1, HIGH); alarm = true; }
  else digitalWrite(RELAY1, LOW);

  if (tank2 < 20) { digitalWrite(RELAY2, HIGH); alarm = true; }
  else digitalWrite(RELAY2, LOW);

  if (tank3 < 20) { digitalWrite(RELAY3, HIGH); alarm = true; }
  else digitalWrite(RELAY3, LOW);

  digitalWrite(RED_LED, alarm);
  digitalWrite(BUZZER, alarm);
  digitalWrite(GREEN_LED, !alarm);

  // Payload
  String payload = "{";
  payload += "\"Tank1\":" + String(tank1, 1) + ",";
  payload += "\"Tank2\":" + String(tank2, 1) + ",";
  payload += "\"Tank3\":" + String(tank3, 1) + ",";
  payload += "\"Pump1\":" + String(digitalRead(RELAY1)) + ",";
  payload += "\"Pump2\":" + String(digitalRead(RELAY2)) + ",";
  payload += "\"Pump3\":" + String(digitalRead(RELAY3)) + ",";
  payload += "\"Alarm\":" + String(alarm);
  payload += "}";

  client.publish("v1/devices/me/telemetry", payload.c_str());

  Serial.println("================================");
  Serial.println(payload);
  Serial.println("================================");

  delay(3000);
}
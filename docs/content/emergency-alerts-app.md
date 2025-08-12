---
title: Emergency Alerts App

metaDescription: Emergency Alerts Self serve guide.
---

# Overview

The **Emergency Alerts** app enables organizations to instantly display urgent messages on their digital signage screens.  
It works by integrating with mass notification systems such as **Omnilert**, **Rave**, **Singlewire**, and **Alertus**—or through a custom, self-serve configuration—to broadcast important updates during critical events.

Key benefits:

- **Multi-channel safety communication**: Complements SMS, email, and other systems for maximum reach.

- **Automatic activation**: Alerts can be triggered without manual intervention when integrated with compatible systems.

- **Location targeting**: Send alerts to specific spaces or screens.

- **Broad applicability**: Ideal for reaching staff and visitors who may not have access to mobile alerts.

This guide provides reference payloads and formatting requirements for using the app’s **Custom (Self-Serve)** option, following the **CAP 1.2** XML standard.

---

## Custom Payload Reference

To use the “Custom” or self-serve option in Emergency Alerts, you’ll need to send CAP-compliant XML payloads to ScreenCloud.  
Below are examples and required formatting details.

---

### Payload for casting an alert to be active

```xml
<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>{#INCIDENT_ID#}</identifier>
  <sender>Raptor Technologies</sender>
  <sent>{#format(TIMESTAMP, 'd:yyyy-MM-ddTHH:mm:sszzz')#}</sent>
  <status>Actual</status>
  <msgType>Actual</msgType>
  <scope>Public</scope>
  <info>
    <category>Safety</category>
    <event>Raptor Alert</event>
    <urgency>Immediate</urgency>
    <severity>Severe</severity>
    <certainty>Likely</certainty>
    <senderName>Raptor Technologies</senderName>
    <headline>{#INCIDENT_TYPENAME#}</headline>
    <description>{#INCIDENT_SUBTYPENAME#} at {#BUILDING_NAME#}</description>
    <instruction>Locks, Lights, Out of Sight</instruction>
    <area>
      <areaDesc>{#BUILDING_NAME#}</areaDesc>
    </area>
  </info>
</alert>
```

It is important to follow a correct format of the payload in order to get the alert to process properly.

> **Tip:** Replace placeholder values (`{#INCIDENT_ID#}`, `{#BUILDING_NAME#}`, etc.) with actual incident data.

---

### Payload for casting an alert to be cancelled

```xml
<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>%INCIDENT_ID%</identifier>
  <sender>Raptor</sender>
  <sent>{#format(TIMESTAMP, 'd:yyyy-MM-ddTHH:mm:sszzz')#}</sent>
  <references>Raptor,%INCIDENT_ID%,%INCIDENT_INITIATED_TIMESTAMP%</references>
  <status>Actual</status>
  <msgType>Cancel</msgType>
  <scope>Public</scope>
  <info>
    <category>Safety</category>
    <event>Cancel</event>
    <urgency>Immediate</urgency>
    <severity>Severe</severity>
    <certainty>Likely</certainty>
    <headline>%INCIDENT_TYPENAME%</headline>
    <description>Cancel</description>
    <instruction>Locks, Lights, Out of Sight</instruction>
    <area>
      <areaDesc>{#BUILDING_NAME#}</areaDesc>
    </area>
  </info>
</alert>
```

> **Note:** As of **15 July 2025**, sending a “Cancel” payload only marks the alert as cancelled—it does **not** automatically stop casting the alert on screens. You must manually clear it in **Studio → Screens**.

---

## CAP 1.2 XML Format Requirements

The system **expects** CAP 1.2–compliant XML with the following structure:

### Root Element

```xml
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
```

### Required Top-Level Elements

1.  `<identifier>` – Unique alert ID (no special characters like `&`, `<`, `,`, or spaces)

2.  `<sender>` – Sender ID (same restrictions as above)

3.  `<sent>` – Timestamp in `YYYY-MM-DDTHH:mm:ss±HH:mm` format (**no “Z” allowed**, UTC must be `-00:00`)

4.  `<status>` – One of: `Actual`, `Exercise`, `System`, `Test`, `Draft`

5.  `<msgType>` – One of: `Alert`, `Update`, `Cancel`, `Ack`, `Error`

6.  `<scope>` – One of: `Public`, `Restricted`, `Private`

---

### Required info Element Contents

Each `<info>` element must contain:

- `<category>` – Array of categories: `Geo`, `Met`, `Safety`, `Security`, `Rescue`, `Fire`, `Health`, `Env`, `Transport`, `Infra`, `CBRNE`, `Other`

- `<event>` – Event description

- `<urgency>` – Must be: `Immediate`, `Expected`, `Future`, `Past`, `Unknown`

- `<severity>` – Must be: `Extreme`, `Severe`, `Moderate`, `Minor`, `Unknown`

- `<certainty>` – Must be: `Observed`, `Likely`, `Possible`, `Unlikely`, `Unknown`

---

### Optional Elements

- `<area>` – Geographic area (`<areaDesc>` required; optional `<polygon>`, `<circle>`, `<geocode>`)

- `<parameter>` – Custom parameters (`<valueName>`, `<value>`)

- `<resource>` – Resources (`<resourceDesc>`, `<mimeType>`, `<uri>`)

- `<headline>`, `<description>`, `<instruction>` – Text content

- `<web>` – URL

- `<effective>`, `<onset>`, `<expires>` – Additional timestamps

---

### Key Validation Rules

- **Date format:** Must use `±HH:mm` timezone, never “Z”.

- **Polygons:** Minimum 4 coordinate pairs, with the first and last matching.

- **Circles:** Must follow `lat,lon radius` format.

- **MIME types:** Must be valid, registered types.

- **URLs:** Must be valid URIs.

- **Private scope:** Requires an `<addresses>` element.

---

# Node-STIB

A set of Node.js helpers to fetch the Brussels Public Transport APIs (STIB).

- 1. [Installation](#Installation)
- 2. [Examples](#Examples)
  - 2.1. [Basic authentication](#Basicauthentication)
  - 2.2. [Get all stops coordinates for a given line](#Getallstopscoordinatesforagivenline)
  - 2.3. [Count all moving vehicles](#Countallmovingvehicles)
- 3. [API documentation](#APIdocumentation)
  - 3.1. [constructor()](#constructor)
  - 3.2. [getToken()](#getToken)
  - 3.3. [getLineDescription()](#getLineDescription)
  - 3.4. [getStopDescription()](#getStopDescription)
  - 3.5. [getVehiclePosition()](#getVehiclePosition)
  - 3.6. [getMessageByLine()](#getMessageByLine)
  - 3.7. [getWaitingTime()](#getWaitingTime)
- 4. [Rate limiting](#RateLimiting)

## 1. <a name='Installation'></a>Installation

> npm i node-stib

You'll need valid STIB API credentials to use this library. For more information, check out the [official developers page](https://opendata.stib-mivb.be/).

Please note that this library is **NOT** an official project from STIB and it is maintained voluntarily under MIT license.

## 2. <a name='Examples'></a>Examples

### 2.1. <a name='Basicauthentication'></a>Basic authentication

#### Authenticate with consumer key & consumer secret

The most straightforward way to authenticate is using a pair of consumer key and consumer secret. This ensures you to always have valid connection to the API.
This will generate an expirable token for further communications with the API.

```javascript
const { Stib } = require('node-stib')

async const fetchMetroLine5Description = () => {
  const stib = new Stib()
  const token = await stib.getToken('consumerKey', 'consumerSecret')

  console.log(token)

  // Once authenticated you can use the API
  return await stib.getLineDescription([5])
}

```

#### Authenticate with a token

Although not reccomended you can also directly connect to the API using a pre-generated token.

```javascript
const { Stib } = require('node-stib')

async const fetchMetroLine5Description = () => {
  const stib = new Stib('tokentokentoken')

  return await stib.getLineDescription([5])
}
```

### 2.2. <a name='Getallstopscoordinatesforagivenline'></a>Get all stops coordinates for a given line

```javascript
const { Stib } = require('node-stib')

async const fetchStopCoordinates = () => {
  const stib = new Stib()
  await stib.getToken('consumerKey', 'consumerSecret')

  const lines = await stib.getLineDescription([61, 92, 93])
  const points = lines
                 .map(line => [ ...line.points ])
                 .flat()
                 .map(point => point.id)

  const stopsCoordinates = await stib.getStopDescription(points)

  return stopsCoordinates
}
```

### 2.3. <a name='Countallmovingvehicles'></a>Count all moving vehicles

```javascript
const { Stib } = require('node-stib')

async const countAllMovingVehicles = () => {
  const stib = new Stib()
  await stib.getToken('consumerKey', 'consumerSecret')

  const lines = []
  for(let i=1;i<100;i++) lines.push(i)

  const movingVehicles = await stib.getVehiclePosition(lines)

  return movingVehicles
         .reduce((ac, cv) => ac += cv.vehiclePositions.length, 0)
}
```

## 3. <a name='APIdocumentation'></a>API documentation

### 3.1. <a name='constructor'></a>constructor()

`new Stib(?token)` initialize a new Stib object.

#### Arguments:

- **token** (string) optional : A temporary token, if no token is provided you should generate one using the `.getToken` method

#### Usage:

```javascript
const { Stib } = require("node-stib");

const stib = new Stib("tokentokentoken");
```

### 3.2. <a name='getToken'></a>getToken()

`await getToken(consumerKey, consumerSecret)` try to create a new temporary token, if a valid token has already been generated in the past hour returns the active valid token.

#### Arguments:

- **consumerKey** (string) : Your personal consumer key
- **consumerSecret** (string) : Your personal consumer secret

Returns a promise containing the an object with an access token and its expiration time.

### 3.3. <a name='getLineDescription'></a>getLineDescription()

`await getLineDescription(lines)` get the description for a set of given lines.

#### Arguments :

- **lines** (array) : An array containing line numbers

Returns a promise containing an array of line descriptions

### 3.4. <a name='getStopDescription'></a>getStopDescription()

`await getStopDescription(stops)` get the description for a set of given stop ids.

#### Arguments :

- **stops** (array) : An array of stop ids

Returns a promise containing an array of stop descriptions.

### 3.5. <a name='getVehiclePosition'></a>getVehiclePosition()

`await getVehiclePosition(lines)` get the realtime positions of vehicle for a set of given lines

#### Arguments :

- **lines** (array) : An array containing line numbers

Returns a promise containing an array of realtime positions per line

### 3.6. <a name='getMessageByLine'></a>getMessageByLine()

`await getMessageByLine(lines)` get a series of maintenance messages for a given set of lines

#### Arguments :

- **lines** (array) : An array containing line numbers

Returns a promise containing an array of maintenance message per line

### 3.7. <a name='getWaitingTime'></a>getWaitingTime()

`await getWaitingTime(stops)` get all incoming vehicles for a list of given stops.

#### Arguments :

- **stops** (array) : An array of stop ids

Returns a promise containing an array of waiting times for each line of the given stops

## 4. Rate Limiting

This library is aware of STIB API's rate limitation and has some builtin helpers to help you prevent hitting the limit too fast.

- Queries are dispatched so you can query up to 200 resources (lines or points) in a single call.
- An array containing multiple instance of the same resource will only be fetched once.

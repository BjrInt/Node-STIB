export type CredentialsResponse = {
  access_token: string,
  scope: string,
  token_type: string,
  expires_in: number
}

export type ErrorMessage = {
  error: string
}

type BilingualDisplay = {
  fr: string,
  nl: string
}

type TrilingualDisplay = {
  en: string,
  fr: string,
  nl: string
}

type Point = {
  id: string | number,
  order: number
}

type Id = {
  id: number | string
}

export type LineDescription = {
  destination: BilingualDisplay,
  direction: string,
  lineId: string | number,
  points: Array<Point>
}

export type StopDescription = {
  id: string | number,
  gpsCoordinates: {
    latitude: number,
    longitude: number
  }
  name: BilingualDisplay
}

type MessageContent = {
  text: Array<TrilingualDisplay>,
  type: string
}

export type Message = {
  content: Array<MessageContent>,
  lines: Array<Id>, 
  points: Array<Id>,
  priority: number,
  type: string
}

type VehiclePosition = {
  directionId: string | number, 
  distanceFromPoint: number,
  pointId: string | number
}

export type LinePositions = {
  lineId: number | string,
  vehiclePositions: Array<VehiclePosition>
}

type PassingTime = {
  destination: BilingualDisplay,
  expectedArrivalTime: string,
  lineId: number | string
}

export type WaitingTime = {
  passingTimes: Array<PassingTime>,
  pointId: number | string
}
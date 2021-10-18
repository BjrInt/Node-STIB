export const BASE_URL = 'opendata-api.stib-mivb.be'

export const ENDPOINTS = {
  NETWORK_DESCRIPTION: {
    LINES: '/NetworkDescription/1.0/PointByLine/',
    STOPS: '/NetworkDescription/1.0/PointDetail/',
  },
  OPERATION_MONITORING: {
    VEHICLE_POSITION: '/OperationMonitoring/4.0/VehiclePositionByLine/',
    WAITING_TIME: '/OperationMonitoring/4.0/PassingTimeByPoint/',
    MESSAGE_BY_LINE: '/OperationMonitoring/4.0/MessageByLine/',
  },
  TOKEN: '/token?grant_type=client_credentials',
}

export const RATE_LIMITS = {
  NETWORK_DESCRIPTION: 20,
  OPERATION_MONITORING: 20,
}

export const LIMIT_QUERY_PARAM = {
  NETWORK_DESCRIPTION: {
    LINES: 10,
    STOPS: 10, // FIXME : Should be 100 according to the documentation
  },
  OPERATION_MONITORING: {
    VEHICLE_POSITION: 10,
    WAITING_TIME: 10,
    MESSAGE_BY_LINE: 10,
  }
}
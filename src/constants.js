"use strict";
exports.__esModule = true;
exports.LIMIT_QUERY_PARAM = exports.RATE_LIMITS = exports.ENDPOINTS = exports.BASE_URL = void 0;
exports.BASE_URL = 'opendata-api.stib-mivb.be';
exports.ENDPOINTS = {
    NETWORK_DESCRIPTION: {
        LINES: '/NetworkDescription/1.0/PointByLine/',
        STOPS: '/NetworkDescription/1.0/PointDetail/'
    },
    OPERATION_MONITORING: {
        VEHICLE_POSITION: '/OperationMonitoring/4.0/VehiclePositionByLine/',
        WAITING_TIME: '/OperationMonitoring/4.0/PassingTimeByPoint/',
        MESSAGE_BY_LINE: '/OperationMonitoring/4.0/MessageByLine/'
    },
    TOKEN: '/token?grant_type=client_credentials'
};
exports.RATE_LIMITS = {
    NETWORK_DESCRIPTION: 20,
    OPERATION_MONITORING: 20
};
exports.LIMIT_QUERY_PARAM = {
    NETWORK_DESCRIPTION: {
        LINES: 10,
        STOPS: 10
    },
    OPERATION_MONITORING: {
        VEHICLE_POSITION: 10,
        WAITING_TIME: 10,
        MESSAGE_BY_LINE: 10
    }
};

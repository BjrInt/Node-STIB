"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.groupedQueries = exports.tokenQuery = exports.httpQuery = exports.splitInSubgroupOf = exports._uniq = exports.base64Encode = void 0;
var https_1 = require("https");
var buffer_1 = require("buffer");
var constants_1 = require("./constants");
var base64Encode = function (str) { return buffer_1.Buffer.from(str).toString('base64'); };
exports.base64Encode = base64Encode;
var _uniq = function (ar) { return __spreadArray([], __read(new Set(ar)), false); };
exports._uniq = _uniq;
var splitInSubgroupOf = function (a, size) {
    var subgroups = a.length / size;
    var returnValue = [];
    for (var i = 0; i < subgroups; i++) {
        returnValue.push(__spreadArray([], __read(a.slice(i * size, (i + 1) * size)), false));
    }
    return returnValue;
};
exports.splitInSubgroupOf = splitInSubgroupOf;
var httpQuery = function (token, endpoint, queryParams) { return new Promise(function (resolve, reject) {
    var options = {
        method: 'GET',
        hostname: constants_1.BASE_URL,
        path: "" + endpoint + queryParams.join('%2C'),
        headers: {
            Authorization: "Bearer " + token
        }
    };
    var req = (0, https_1.request)(options, function (response) {
        var chunks = [];
        response.on('data', function (c) { chunks.push(c); });
        response.on('end', function () {
            var ret = buffer_1.Buffer.concat(chunks).toString();
            try {
                var json = JSON.parse(ret);
                return resolve(json);
            }
            catch (err) {
                if (ret.match('Missing Credentials'))
                    return reject({ error: 'MISSING_CREDENTIALS' });
                else if (ret.match('Invalid Credentials'))
                    return reject({ error: 'INVALID_CREDENTIALS' });
                else if (ret.match('Message throttled out'))
                    return reject({ error: 'RATE_LIMIT_EXCEEDED' });
                return reject({ error: 'INVALID_RESPONSE' });
            }
        });
        response.on('error', function (err) { return reject(err); });
    });
    req.end();
}); };
exports.httpQuery = httpQuery;
var tokenQuery = function (cKey, cSecret) { return new Promise(function (resolve, reject) {
    var options = {
        method: 'POST',
        hostname: constants_1.BASE_URL,
        path: constants_1.ENDPOINTS.TOKEN,
        headers: {
            Authorization: "Basic " + (0, exports.base64Encode)(cKey + ':' + cSecret)
        }
    };
    var req = (0, https_1.request)(options, function (response) {
        var chunks = [];
        response.on('data', function (c) { chunks.push(c); });
        response.on('end', function () {
            var ret = buffer_1.Buffer.concat(chunks).toString();
            try {
                var json = JSON.parse(ret);
                return resolve(json);
            }
            catch (err) {
                return reject(err);
            }
        });
        response.on('error', function (err) { return reject(err); });
    });
    req.end();
}); };
exports.tokenQuery = tokenQuery;
var groupedQueries = function (arg, token, endpoint, resource, responseCallback) {
    return new Promise(function (resolve, reject) {
        if (!token)
            return reject({ error: 'MISSING_CREDENTIALS' });
        if (arg.length > constants_1.LIMIT_QUERY_PARAM[endpoint][resource] * constants_1.RATE_LIMITS[endpoint])
            return reject({ error: 'RATE_LIMIT_EXCEEDED' });
        var queries = (0, exports.splitInSubgroupOf)((0, exports._uniq)(arg), constants_1.LIMIT_QUERY_PARAM[endpoint][resource])
            .map(function (q) { return (0, exports.httpQuery)(token, constants_1.ENDPOINTS[endpoint][resource], q); });
        return Promise.all(queries)
            .then(function (data) { return resolve(responseCallback(data)); })["catch"](function (err) { return reject(err); });
    });
};
exports.groupedQueries = groupedQueries;

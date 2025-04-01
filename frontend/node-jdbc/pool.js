"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var uuid_1 = require("uuid");
var console = require("console");
var jinst_1 = require("./jinst");
var drivermanager_1 = require("./drivermanager");
var connection_1 = require("./connection");
var java = jinst_1["default"].getInstance();
if (!jinst_1["default"].getInstance().isJvmCreated()) {
    jinst_1["default"].getInstance().addOption("-Xrs");
}
var keepalive = function (conn, query) { return __awaiter(void 0, void 0, void 0, function () {
    var connection, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, conn.createStatement()];
            case 1:
                connection = _a.sent();
                connection.execute(query);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addConnection = function (url, props, ka, maxIdle) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                drivermanager_1["default"].getConnection(url, props)
                    .then(function (conn) {
                    var connobj = {
                        uuid: (0, uuid_1.v4)(),
                        conn: new connection_1["default"](conn),
                        keepalive: ka.enabled
                            ? setInterval(function () { return keepalive(conn, ka.query); }, ka.interval)
                            : false
                    };
                    if (maxIdle) {
                        connobj.lastIdle = new Date().getTime();
                    }
                    resolve(connobj);
                })["catch"](function (err) {
                    reject(err);
                });
            })];
    });
}); };
var addConnectionSync = function (url, props, ka, maxIdle) {
    var conn = drivermanager_1["default"].getConnectionSync(url, props);
    var connobj = {
        uuid: (0, uuid_1.v4)(),
        conn: new connection_1["default"](conn),
        keepalive: ka.enabled
            ? setInterval(keepalive, ka.interval, conn, ka.query)
            : false,
        lastIdle: undefined
    };
    if (maxIdle) {
        connobj.lastIdle = new Date().getTime();
    }
    return connobj;
};
var Pool = /** @class */ (function () {
    function Pool(config) {
        this._pool = [];
        this._reserved = [];
        this._url = config.url;
        this._props = (function () {
            var Properties = java["import"]("java.util.Properties");
            var properties = new Properties();
            for (var name_1 in config.properties) {
                properties.putSync(name_1, config.properties[name_1]);
            }
            if (config.user && properties.getPropertySync("user") === null) {
                properties.putSync("user", config.user);
            }
            if (config.password && properties.getPropertySync("password") === null) {
                properties.putSync("password", config.password);
            }
            return properties;
        })();
        this._drivername = config.drivername || "";
        this._minpoolsize = config.minpoolsize || 1;
        this._maxpoolsize = config.maxpoolsize || 1;
        this._keepalive = config.keepalive || {
            interval: 60000,
            query: "select 1",
            enabled: false
        };
        this._maxidle =
            !this._keepalive.enabled && config.maxidle ? config.maxidle : null;
        this._logging = config.logging || { level: "error" };
    }
    Pool.prototype.status = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        status = {};
                        status.available = this._pool.length;
                        status.reserved = this._reserved.length;
                        _a = status;
                        return [4 /*yield*/, this.connStatus([], this._pool)];
                    case 1:
                        _a.pool = _c.sent();
                        _b = status;
                        return [4 /*yield*/, this.connStatus([], this._reserved)];
                    case 2:
                        _b.rpool = _c.sent();
                        return [2 /*return*/, status];
                }
            });
        });
    };
    Pool.prototype.connStatus = function (acc, pool) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, pool.reduce(function (conns, connobj) {
                        var conn = connobj.conn;
                        var closed = conn.isClosedSync();
                        var readonly = conn.isReadOnlySync();
                        var valid = conn.isValidSync(1000);
                        conns.push({
                            uuid: connobj.uuid,
                            closed: closed,
                            readonly: readonly,
                            valid: valid
                        });
                        return conns;
                    }, acc)];
            });
        });
    };
    Pool.prototype._addConnectionsOnInitialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conns;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all(Array.from({ length: this._minpoolsize }, function () {
                            return addConnection(_this._url, _this._props, _this._keepalive, _this._maxidle);
                        }))];
                    case 1:
                        conns = _b.sent();
                        (_a = this._pool).push.apply(_a, conns);
                        return [2 /*return*/];
                }
            });
        });
    };
    Pool.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var driver, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!this._drivername) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                resolve(java.newInstance(_this._drivername));
                            })];
                    case 1:
                        driver = _a.sent();
                        // Use the registerDriver method that returns a promise
                        return [4 /*yield*/, drivermanager_1["default"].registerDriver(driver)];
                    case 2:
                        // Use the registerDriver method that returns a promise
                        _a.sent();
                        _a.label = 3;
                    case 3: 
                    // Add connections after initialization
                    return [4 /*yield*/, this._addConnectionsOnInitialize()];
                    case 4:
                        // Add connections after initialization
                        _a.sent();
                        jinst_1["default"].getInstance().events.emit("initialized");
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.error(err_1);
                        throw err_1; // Rethrow the error for handling in the calling code
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Pool.prototype.reserve = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn;
            return __generator(this, function (_a) {
                this._closeIdleConnections();
                conn = null;
                if (this._pool.length > 0) {
                    conn = this._pool.shift();
                    if (conn.lastIdle) {
                        conn.lastIdle = new Date().getTime();
                    }
                    this._reserved.unshift(conn);
                }
                else if (this._reserved.length < this._maxpoolsize) {
                    try {
                        conn = addConnectionSync(this._url, this._props, this._keepalive, this._maxidle);
                        this._reserved.unshift(conn);
                    }
                    catch (err) {
                        console.error(err);
                        conn = null;
                        throw err;
                    }
                }
                if (!conn) {
                    conn = addConnectionSync(this._url, this._props, this._keepalive, this._maxidle);
                }
                return [2 /*return*/, conn];
            });
        });
    };
    Pool.prototype._closeIdleConnections = function () {
        if (!this._maxidle) {
            return;
        }
        this.closeIdleConnectionsInArray(this._pool, this._maxidle);
        this.closeIdleConnectionsInArray(this._reserved, this._maxidle);
    };
    Pool.prototype.closeIdleConnectionsInArray = function (array, maxIdle) {
        var time = new Date().getTime();
        var maxLastIdle = time - maxIdle;
        for (var i = array.length - 1; i >= 0; i--) {
            var conn = array[i];
            if (typeof conn === "object" && conn.conn !== null) {
                if (!conn.lastIdle)
                    return;
                if (conn.lastIdle < maxLastIdle) {
                    conn.conn.close();
                    array.splice(i, 1);
                }
            }
        }
    };
    Pool.prototype.release = function (conn) {
        return __awaiter(this, void 0, void 0, function () {
            var uuid_2;
            return __generator(this, function (_a) {
                if (typeof conn === "object") {
                    uuid_2 = conn.uuid;
                    // Use native filter instead of Lodash's reject
                    this._reserved = this._reserved.filter(function (reservedConn) { return reservedConn.uuid !== uuid_2; });
                    if (conn.lastIdle) {
                        conn.lastIdle = Date.now(); // Using Date.now() for better performance
                    }
                    this._pool.unshift(conn); // Add the connection back to the pool
                }
                else {
                    throw new Error("INVALID CONNECTION");
                }
                return [2 /*return*/];
            });
        });
    };
    Pool.prototype.purge = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conns = __spreadArray(__spreadArray([], this._pool, true), this._reserved, true);
                        return [4 /*yield*/, Promise.all(conns.map(function (conn) {
                                if (typeof conn === "object" && conn.conn !== null) {
                                    return new Promise(function (resolve) {
                                        conn.conn.close(function () { return resolve(); });
                                    });
                                }
                                else {
                                    return Promise.resolve();
                                }
                            }))];
                    case 1:
                        _a.sent();
                        this._pool = [];
                        this._reserved = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    return Pool;
}());
exports["default"] = Pool;

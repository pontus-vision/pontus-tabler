/* jshint node: true */
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
var resultset_1 = require("./resultset");
var jinst_1 = require("./jinst");
var java = jinst_1["default"].getInstance();
var Statement = /** @class */ (function () {
    function Statement(s) {
        this._s = s;
    }
    Statement.prototype.addBatch = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("NOT IMPLEMENTED");
            });
        });
    };
    Statement.prototype.cancel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.cancelSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    Statement.prototype.clearBatch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.clearBatchSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    Statement.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.closeSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    Statement.prototype.executeUpdate = function (sql, arg1) {
        return __awaiter(this, arguments, void 0, function () {
            var args;
            var _this = this;
            return __generator(this, function (_a) {
                args = Array.from(__spreadArray([], arguments, true));
                if (!(typeof args[0] === "string" && args[1] === undefined)) {
                    throw new Error("INVALID ARGUMENTS");
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.executeUpdateSync(sql));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    Statement.prototype.executeQuery = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._s.executeQuerySync(sql)));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    Statement.prototype.execute = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var s, isResultSet, resultset, count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof sql !== "string") {
                            throw new Error("INVALID ARGUMENTS");
                        }
                        s = this._s;
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                try {
                                    resolve(s.executeSync(sql));
                                }
                                catch (error) {
                                    reject(error);
                                }
                            })];
                    case 1:
                        isResultSet = _a.sent();
                        if (!isResultSet) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                try {
                                    resolve(s.getResultSetSync());
                                }
                                catch (error) {
                                    reject(error);
                                }
                                ;
                            })];
                    case 2:
                        resultset = _a.sent();
                        return [2 /*return*/, new resultset_1["default"](resultset)];
                    case 3: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            try {
                                resolve(s.getUpdateCountSync());
                            }
                            catch (error) {
                                reject(error);
                            }
                        })];
                    case 4:
                        count = _a.sent();
                        return [2 /*return*/, count];
                }
            });
        });
    };
    Statement.prototype.getFetchSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.getFetchSizeSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    Statement.prototype.setFetchSize = function (rows) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.setFetchSizeSync(rows));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    Statement.prototype.getMaxRows = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.getMaxRowsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    Statement.prototype.setMaxRows = function (max) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.setMaxRowsSync(max));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    Statement.prototype.getQueryTimeout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.getQueryTimeoutSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    Statement.prototype.setQueryTimeout = function (seconds) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.setQueryTimeoutSync(seconds));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    Statement.prototype.getGeneratedKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._s.getGeneratedKeysSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    return Statement;
}());
// Initialize constants like in the original code
jinst_1["default"].getInstance().events.once("initialized", function onInitialized() {
    Statement.CLOSE_CURRENT_RESULT = java.getStaticFieldValue("java.sql.Statement", "CLOSE_CURRENT_RESULT");
    Statement.KEEP_CURRENT_RESULT = java.getStaticFieldValue("java.sql.Statement", "KEEP_CURRENT_RESULT");
    Statement.CLOSE_ALL_RESULTS = java.getStaticFieldValue("java.sql.Statement", "CLOSE_ALL_RESULTS");
    Statement.SUCCESS_NO_INFO = java.getStaticFieldValue("java.sql.Statement", "SUCCESS_NO_INFO");
    Statement.EXECUTE_FAILED = java.getStaticFieldValue("java.sql.Statement", "EXECUTE_FAILED");
    Statement.RETURN_GENERATED_KEYS = java.getStaticFieldValue("java.sql.Statement", "RETURN_GENERATED_KEYS");
    Statement.NO_GENERATED_KEYS = java.getStaticFieldValue("java.sql.Statement", "NO_GENERATED_KEYS");
});
exports["default"] = Statement;

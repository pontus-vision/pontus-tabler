/* jshint node: true */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.__esModule = true;
var resultset_1 = require("./resultset");
var statement_1 = require("./statement");
var PreparedStatement = /** @class */ (function (_super) {
    __extends(PreparedStatement, _super);
    function PreparedStatement(ps) {
        var _this = _super.call(this, ps) || this;
        _this._ps = ps;
        return _this;
    }
    PreparedStatement.prototype.addBatch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.addBatchSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.clearParameters = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.clearParametersSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.executeSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.executeBatch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.executeBatchSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.executeQuery = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._ps.executeQuerySync()));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.executeUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.executeUpdateSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.getMetaData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.getMetaDataSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.getParameterMetaData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("NOT IMPLEMENTED");
            });
        });
    };
    PreparedStatement.prototype.setArray = function (index, val) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("NOT IMPLEMENTED");
            });
        });
    };
    PreparedStatement.prototype.setAsciiStream = function (index, val, length) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("NOT IMPLEMENTED");
            });
        });
    };
    PreparedStatement.prototype.setBigDecimal = function (index, val) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.setBigDecimalSync(index, val));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    PreparedStatement.prototype.setBinaryStream = function (index, val, length) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("NOT IMPLEMENTED");
            });
        });
    };
    PreparedStatement.prototype.setBlob = function (index, val, length) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("NOT IMPLEMENTED");
            });
        });
    };
    PreparedStatement.prototype.setBoolean = function (index, val) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.setBooleanSync(index, val));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.setByte = function (index, val) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.setByteSync(index, val));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    PreparedStatement.prototype.setBytes = function (index, val) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.setBytesSync(index, val));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    PreparedStatement.prototype.setCharacterStream = function (index, val, length) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("NOT IMPLEMENTED");
            });
        });
    };
    PreparedStatement.prototype.setClob = function (index, val, length) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("NOT IMPLEMENTED");
            });
        });
    };
    PreparedStatement.prototype.setDate = function (index, val, calendar) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (calendar === null) {
                            try {
                                resolve(_this._ps.setDateSync(index, val));
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                        else {
                            try {
                                resolve(_this._ps.setDateSync(index, val, calendar));
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.setDouble = function (index, val) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.setDoubleSync(index, val));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.setFloat = function (index, val) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.setFloatSync(index, val));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    PreparedStatement.prototype.setInt = function (index, val) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.setIntSync(index, val));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    PreparedStatement.prototype.setLong = function (index, val) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.setLongSync(index, val));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    PreparedStatement.prototype.setString = function (index, val) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._ps.setStringSync(index, val));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    PreparedStatement.prototype.setTime = function (index, val, calendar) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (calendar === null) {
                            try {
                                resolve(_this._ps.setTimeSync(index, val));
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                        else {
                            try {
                                resolve(_this._ps.setTimeSync(index, val, calendar));
                            }
                            catch (error) {
                                reject(error);
                            }
                            ;
                        }
                    })];
            });
        });
    };
    PreparedStatement.prototype.setTimestamp = function (index, val, calendar) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (calendar === null) {
                            try {
                                resolve(_this._ps.setTimestampSync(index, val));
                            }
                            catch (error) {
                                reject(error);
                            }
                            ;
                        }
                        else {
                            try {
                                resolve(_this._ps.setTimestampSync(index, val, calendar));
                            }
                            catch (error) {
                                reject(error);
                            }
                            ;
                        }
                    })];
            });
        });
    };
    return PreparedStatement;
}(statement_1["default"]));
exports["default"] = PreparedStatement;

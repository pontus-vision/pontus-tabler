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
exports.__esModule = true;
var jinst_1 = require("./jinst");
var resultsetmetadata_1 = require("./resultsetmetadata");
var java = jinst_1["default"].getInstance();
if (!jinst_1["default"].getInstance().isJvmCreated()) {
    jinst_1["default"].getInstance().addOption('-Xrs');
}
var ResultSet = /** @class */ (function () {
    function ResultSet(rs) {
        this._rs = rs;
        this._holdability = (function () {
            var h = [];
            h[java.getStaticFieldValue('java.sql.ResultSet', 'CLOSE_CURSORS_AT_COMMIT')] = 'CLOSE_CURSORS_AT_COMMIT';
            h[java.getStaticFieldValue('java.sql.ResultSet', 'HOLD_CURSORS_OVER_COMMIT')] = 'HOLD_CURSORS_OVER_COMMIT';
            return h;
        })();
        this._types = (function () {
            var typeNames = [];
            typeNames[java.getStaticFieldValue('java.sql.Types', 'BIT')] = 'Boolean';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'TINYINT')] = 'Short';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'SMALLINT')] = 'Short';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'INTEGER')] = 'Int';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'BIGINT')] = 'String';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'FLOAT')] = 'Float';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'REAL')] = 'Float';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'DOUBLE')] = 'Double';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'NUMERIC')] = 'BigDecimal';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'DECIMAL')] = 'BigDecimal';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'CHAR')] = 'String';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'VARCHAR')] = 'String';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'LONGVARCHAR')] = 'String';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'DATE')] = 'Date';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'TIME')] = 'Time';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'TIMESTAMP')] = 'Timestamp';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'BOOLEAN')] = 'Boolean';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'NCHAR')] = 'String';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'NVARCHAR')] = 'String';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'LONGNVARCHAR')] = 'String';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'BINARY')] = 'Bytes';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'VARBINARY')] = 'Bytes';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'LONGVARBINARY')] = 'Bytes';
            typeNames[java.getStaticFieldValue('java.sql.Types', 'BLOB')] = 'Bytes';
            return typeNames;
        })();
    }
    ResultSet.prototype.toObjArray = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toObject()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    ResultSet.prototype.toObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rs, rowIter, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toObjectIter()];
                    case 1:
                        rs = _a.sent();
                        rowIter = rs.rows;
                        rows = [];
                        row = rowIter.next();
                        while (!row.done) {
                            rows.push(row.value);
                            row = rowIter.next();
                        }
                        rs.rows = rows;
                        return [2 /*return*/, rs];
                }
            });
        });
    };
    ResultSet.prototype.toObjectIter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rsmd, colsmetadata, count, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMetaData()];
                    case 1:
                        rsmd = _a.sent();
                        colsmetadata = [];
                        return [4 /*yield*/, rsmd.getColumnCount()];
                    case 2:
                        count = _a.sent();
                        // Use a for loop instead of Lodash's each and range
                        for (i = 1; i <= count; i++) {
                            colsmetadata.push({
                                label: rsmd._rsmd.getColumnLabelSync(i),
                                type: rsmd._rsmd.getColumnTypeSync(i)
                            });
                        }
                        return [2 /*return*/, {
                                labels: colsmetadata.map(function (col) { return col.label; }),
                                types: colsmetadata.map(function (col) { return col.type; }),
                                rows: {
                                    next: function () {
                                        try {
                                            var nextRow = _this._rs.nextSync();
                                            if (!nextRow) {
                                                return { done: true };
                                            }
                                            var result = {};
                                            // Use a for loop instead of Lodash's each and range
                                            for (var i = 1; i <= count; i++) {
                                                var cmd = colsmetadata[i - 1];
                                                var type = _this._types[cmd.type] || 'String';
                                                var getter = 'get' + (type === 'BigDecimal' ? 'Double' : type) + 'Sync';
                                                if (type === 'Date' || type === 'Time' || type === 'Timestamp') {
                                                    var dateVal = _this._rs[getter](cmd.label);
                                                    result[cmd.label] = dateVal ? dateVal.toString() : null;
                                                }
                                                else {
                                                    result[cmd.label] = _this._rs[getter](cmd.label);
                                                }
                                            }
                                            return { value: result, done: false };
                                        }
                                        catch (error) {
                                            throw new Error(error);
                                        }
                                    }
                                }
                            }];
                }
            });
        });
    };
    ResultSet.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._rs.closeSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    ResultSet.prototype.getMetaData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var _a;
                        try {
                            resolve(new resultsetmetadata_1["default"]((_a = _this._rs) === null || _a === void 0 ? void 0 : _a.getMetaDataSync()));
                        }
                        catch (error) {
                            reject(error);
                        }
                        ;
                    })];
            });
        });
    };
    return ResultSet;
}());
exports["default"] = ResultSet;

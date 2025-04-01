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
var resultset_1 = require("./resultset");
var connection_1 = require("./connection");
var jinst_1 = require("./jinst");
var java = jinst_1["default"].getInstance();
var RowIdLifetime;
(function (RowIdLifetime) {
    RowIdLifetime[RowIdLifetime["ROWID_UNSUPPORTED"] = 0] = "ROWID_UNSUPPORTED";
    RowIdLifetime[RowIdLifetime["ROWID_VALID_FOREVER"] = 1] = "ROWID_VALID_FOREVER";
    RowIdLifetime[RowIdLifetime["ROWID_VALID_SESSION"] = 2] = "ROWID_VALID_SESSION";
    RowIdLifetime[RowIdLifetime["ROWID_VALID_TRANSACTION"] = 3] = "ROWID_VALID_TRANSACTION";
    RowIdLifetime[RowIdLifetime["ROWID_VALID_OTHER"] = 4] = "ROWID_VALID_OTHER";
})(RowIdLifetime || (RowIdLifetime = {}));
var DatabaseMetaData = /** @class */ (function () {
    function DatabaseMetaData(dbm) {
        this._dbm = dbm;
    }
    DatabaseMetaData.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var staticAttrs, _i, staticAttrs_1, attr, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        staticAttrs = [
                            "attributeNoNulls",
                            "attributeNullable",
                            "attributeNullableUnknown",
                            "bestRowNotPseudo",
                            // Add all other static fields as needed
                        ];
                        _i = 0, staticAttrs_1 = staticAttrs;
                        _c.label = 1;
                    case 1:
                        if (!(_i < staticAttrs_1.length)) return [3 /*break*/, 4];
                        attr = staticAttrs_1[_i];
                        _a = DatabaseMetaData;
                        _b = attr;
                        return [4 /*yield*/, java.getStaticFieldValue("java.sql.DatabaseMetaData", attr)];
                    case 2:
                        _a[_b] = _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseMetaData.prototype.getSchemas = function (catalog, schemaPattern) {
        if (catalog === void 0) { catalog = null; }
        if (schemaPattern === void 0) { schemaPattern = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (catalog !== null && typeof catalog !== 'string') {
                    throw new Error("INVALID_ARGUMENTS: catalog must be a string or null.");
                }
                if (schemaPattern !== null && typeof schemaPattern !== 'string') {
                    throw new Error("INVALID_ARGUMENTS: schemaPattern must be a string or null.");
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getSchemasSync(catalog, schemaPattern));
                        }
                        catch (error) {
                            reject(reject);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getTables = function (catalog, schemaPattern, tableNamePattern, types) {
        if (catalog === void 0) { catalog = null; }
        if (schemaPattern === void 0) { schemaPattern = null; }
        if (tableNamePattern === void 0) { tableNamePattern = null; }
        if (types === void 0) { types = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, types_1, type;
            var _this = this;
            return __generator(this, function (_a) {
                if (catalog !== null && typeof catalog !== 'string') {
                    throw new Error("INVALID_ARGUMENTS: catalog must be a string or null.");
                }
                if (schemaPattern !== null && typeof schemaPattern !== 'string') {
                    throw new Error("INVALID_ARGUMENTS: schemaPattern must be a string or null.");
                }
                if (tableNamePattern !== null && typeof tableNamePattern !== 'string') {
                    throw new Error("INVALID_ARGUMENTS: tableNamePattern must be a string or null.");
                }
                if (types !== null && !Array.isArray(types)) {
                    throw new Error("INVALID_ARGUMENTS: types must be an array or null.");
                }
                if (Array.isArray(types)) {
                    for (_i = 0, types_1 = types; _i < types_1.length; _i++) {
                        type = types_1[_i];
                        if (typeof type !== 'string') {
                            throw new Error("INVALID_ARGUMENTS: all elements in types array must be strings.");
                        }
                    }
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getTablesSync(catalog, schemaPattern, tableNamePattern, types));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.allProceduresAreCallable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.allProceduresAreCallableSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.allTablesAreSelectable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.allTablesAreSelectableSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.autoCommitFailureClosesAllResultSets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.autoCommitFailureClosesAllResultSetsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.dataDefinitionCausesTransactionCommit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.dataDefinitionCausesTransactionCommitSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.dataDefinitionIgnoredInTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.dataDefinitionIgnoredInTransactionsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.deletesAreDetected = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!Number.isInteger(type)) {
                            return reject(new Error("INVALID ARGUMENTS"));
                        }
                        try {
                            resolve(_this._dbm.deletesAreDetectedSync(type));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.doesMaxRowSizeIncludeBlobs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.doesMaxRowSizeIncludeBlobsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of generatedKeyAlwaysReturned
    DatabaseMetaData.prototype.generatedKeyAlwaysReturned = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.generatedKeyAlwaysReturnedSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getAttributes
    DatabaseMetaData.prototype.getAttributes = function (catalog, schemaPattern, typeNamePattern, attributeNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if ((catalog === null || catalog === undefined || typeof catalog === "string") &&
                            (schemaPattern === null || schemaPattern === undefined || typeof schemaPattern === "string") &&
                            (typeNamePattern === null || typeNamePattern === undefined || typeof typeNamePattern === "string") &&
                            (attributeNamePattern === null || attributeNamePattern === undefined || typeof attributeNamePattern === "string")) {
                            try {
                                resolve(new resultset_1["default"](_this._dbm.getAttributesSync(catalog, schemaPattern, typeNamePattern, attributeNamePattern)));
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                        else {
                            reject(new Error("INVALID ARGUMENTS"));
                        }
                    })];
            });
        });
    };
    // Promisified version of getBestRowIdentifier
    DatabaseMetaData.prototype.getBestRowIdentifier = function (catalog, schema, table, scope, nullable) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if ((catalog === null || catalog === undefined || typeof catalog === "string") &&
                            (schema === null || schema === undefined || typeof schema === "string") &&
                            typeof table === "string" &&
                            Number.isInteger(scope) &&
                            typeof nullable === "boolean") {
                            try {
                                resolve(new resultset_1["default"](_this._dbm.getBestRowIdentifierSync(catalog, schema, table, scope, nullable)));
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                        else {
                            reject(new Error("INVALID ARGUMENTS"));
                        }
                    })];
            });
        });
    };
    // Promisified version of getCatalogs
    DatabaseMetaData.prototype.getCatalogs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._dbm.getCatalogsSync()));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getCatalogSeparator
    DatabaseMetaData.prototype.getCatalogSeparator = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getCatalogSeparatorSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getCatalogTerm
    DatabaseMetaData.prototype.getCatalogTerm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getCatalogTermSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getClientInfoProperties
    DatabaseMetaData.prototype.getClientInfoProperties = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._dbm.getClientInfoPropertiesSync()));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getColumnPrivileges
    DatabaseMetaData.prototype.getColumnPrivileges = function (catalog, schema, table, columnNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if ((catalog === null || catalog === undefined || typeof catalog === "string") &&
                            (schema === null || schema === undefined || typeof schema === "string") &&
                            typeof table === "string" &&
                            (columnNamePattern === null || columnNamePattern === undefined || typeof columnNamePattern === "string")) {
                            try {
                                resolve(new resultset_1["default"](_this._dbm.getColumnPrivilegesSync(catalog, schema, table, columnNamePattern)));
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                        else {
                            reject(new Error("INVALID ARGUMENTS"));
                        }
                    })];
            });
        });
    };
    // Promisified version of getColumns
    DatabaseMetaData.prototype.getColumns = function (catalog, schemaPattern, tableNamePattern, columnNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if ((catalog === null || catalog === undefined || typeof catalog === "string") &&
                            (schemaPattern === null || schemaPattern === undefined || typeof schemaPattern === "string") &&
                            (tableNamePattern === null || tableNamePattern === undefined || typeof tableNamePattern === "string") &&
                            (columnNamePattern === null || columnNamePattern === undefined || typeof columnNamePattern === "string")) {
                            try {
                                resolve(new resultset_1["default"](_this._dbm.getColumnsSync(catalog, schemaPattern, tableNamePattern, columnNamePattern)));
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                        else {
                            reject(new Error("INVALID ARGUMENTS"));
                        }
                    })];
            });
        });
    };
    // Promisified version of getConnection
    DatabaseMetaData.prototype.getConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new connection_1["default"](_this._dbm.getConnectionSync()));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getCrossReference = function (parentCatalog, parentSchema, parentTable, foreignCatalog, foreignSchema, foreignTable) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if ((parentCatalog === null || typeof parentCatalog === "string") &&
                            (parentSchema === null || typeof parentSchema === "string") &&
                            typeof parentTable === "string" &&
                            (foreignCatalog === null || typeof foreignCatalog === "string") &&
                            (foreignSchema === null || typeof foreignSchema === "string") &&
                            typeof foreignTable === "string") {
                            try {
                                resolve(new resultset_1["default"](_this._dbm.getCrossReferenceSync(parentCatalog, parentSchema, parentTable, foreignCatalog, foreignSchema, foreignTable)));
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                        else {
                            reject(new Error("INVALID ARGUMENTS"));
                        }
                    })];
            });
        });
    };
    // Promisified version of getDatabaseMajorVersion
    DatabaseMetaData.prototype.getDatabaseMajorVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getDatabaseMajorVersionSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getDatabaseMinorVersion
    DatabaseMetaData.prototype.getDatabaseMinorVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getDatabaseMinorVersionSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getDatabaseProductName
    DatabaseMetaData.prototype.getDatabaseProductName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getDatabaseProductNameSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getDatabaseProductVersion
    DatabaseMetaData.prototype.getDatabaseProductVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getDatabaseProductVersionSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getDefaultTransactionIsolation
    DatabaseMetaData.prototype.getDefaultTransactionIsolation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getDefaultTransactionIsolationSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getDriverMajorVersion
    DatabaseMetaData.prototype.getDriverMajorVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getDriverMajorVersionSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getDriverMinorVersion
    DatabaseMetaData.prototype.getDriverMinorVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getDriverMinorVersionSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getDriverName
    DatabaseMetaData.prototype.getDriverName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getDriverNameSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getDriverVersion
    DatabaseMetaData.prototype.getDriverVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getDriverVersionSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getExportedKeys
    DatabaseMetaData.prototype.getExportedKeys = function (catalog, schema, table) {
        return __awaiter(this, void 0, void 0, function () {
            var validParams;
            var _this = this;
            return __generator(this, function (_a) {
                validParams = (catalog === null || catalog === undefined || typeof catalog === "string") &&
                    (schema === null || schema === undefined || typeof schema === "string") &&
                    typeof table === "string";
                if (!validParams) {
                    throw new Error("INVALID ARGUMENTS");
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._dbm.getExportedKeysSync(catalog, schema, table)));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getExtraNameCharacters
    DatabaseMetaData.prototype.getExtraNameCharacters = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getExtraNameCharactersSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getFunctionColumns
    DatabaseMetaData.prototype.getFunctionColumns = function (catalog, schemaPattern, functionNamePattern, columnNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var validParams;
            var _this = this;
            return __generator(this, function (_a) {
                validParams = (catalog === null || catalog === undefined || typeof catalog === "string") &&
                    (schemaPattern === null || schemaPattern === undefined || typeof schemaPattern === "string") &&
                    (functionNamePattern === null || functionNamePattern === undefined || typeof functionNamePattern === "string") &&
                    (columnNamePattern === null || columnNamePattern === undefined || typeof columnNamePattern === "string");
                if (!validParams) {
                    throw new Error("INVALID ARGUMENTS");
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._dbm.getFunctionColumnsSync(catalog, schemaPattern, functionNamePattern, columnNamePattern)));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    // Promisified version of getFunctions
    DatabaseMetaData.prototype.getFunctions = function (catalog, schemaPattern, functionNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var validParams;
            var _this = this;
            return __generator(this, function (_a) {
                validParams = (catalog === null || catalog === undefined || typeof catalog === "string") &&
                    (schemaPattern === null || schemaPattern === undefined || typeof schemaPattern === "string") &&
                    (functionNamePattern === null || functionNamePattern === undefined || typeof functionNamePattern === "string");
                if (!validParams) {
                    throw new Error("INVALID ARGUMENTS");
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._dbm.getFunctionsSync(catalog, schemaPattern, functionNamePattern)));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getIdentifierQuoteString = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getIdentifierQuoteStringSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getImportedKeys = function (catalog, schema, table) {
        return __awaiter(this, void 0, void 0, function () {
            var validParams;
            var _this = this;
            return __generator(this, function (_a) {
                validParams = (catalog === null || typeof catalog === "string") &&
                    (schema === null || typeof schema === "string") &&
                    typeof table === "string";
                if (!validParams) {
                    throw new Error("INVALID ARGUMENTS");
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var result = _this._dbm.getImportedKeysSync(catalog, schema, table);
                            resolve(new resultset_1["default"](result));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getIndexInfo = function (catalog, schema, table, unique, approximate) {
        return __awaiter(this, void 0, void 0, function () {
            var validParams;
            var _this = this;
            return __generator(this, function (_a) {
                validParams = (catalog === null || typeof catalog === "string") &&
                    (schema === null || typeof schema === "string") &&
                    typeof table === "string" &&
                    typeof unique === "boolean" &&
                    typeof approximate === "boolean";
                if (!validParams) {
                    throw new Error("INVALID ARGUMENTS");
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var result = _this._dbm.getIndexInfoSync(catalog, schema, table, unique, approximate);
                            resolve(new resultset_1["default"](result));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getJDBCMajorVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getJDBCMajorVersionSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getJDBCMinorVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getJDBCMinorVersionSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxBinaryLiteralLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxBinaryLiteralLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxCatalogNameLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxCatalogNameLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxCharLiteralLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxCharLiteralLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxColumnNameLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxColumnNameLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxColumnsInGroupBy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxColumnsInGroupBySync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxColumnsInIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxColumnsInIndexSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxColumnsInOrderBy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxColumnsInOrderBySync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxColumnsInSelect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxColumnsInSelectSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxColumnsInTable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxColumnsInTableSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxConnections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxConnectionsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxCursorNameLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxCursorNameLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxIndexLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxIndexLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxProcedureNameLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxProcedureNameLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxRowSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxRowSizeSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxSchemaNameLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxSchemaNameLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxStatementLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxStatementLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxStatements = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxStatementsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    DatabaseMetaData.prototype.getMaxTableNameLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxTableNameLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves the maximum number of tables this database allows in a SELECT statement.
     *
     * @returns A promise that resolves to the maximum number of tables allowed in a SELECT statement.
     */
    DatabaseMetaData.prototype.getMaxTablesInSelect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxTablesInSelectSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves the maximum number of characters allowed in a user name.
     *
     * @returns A promise that resolves to the maximum number of characters allowed for a user name.
     */
    DatabaseMetaData.prototype.getMaxUserNameLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getMaxUserNameLengthSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a comma-separated list of math functions available with this database.
     *
     * @returns A promise that resolves to the list of math functions supported by this database.
     */
    DatabaseMetaData.prototype.getNumericFunctions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getNumericFunctionsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a description of the given table's primary key columns.
     *
     * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
     * @param schema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
     * @param table - A table name; must match the table name as it is stored in this database
     * @returns A promise that resolves to a ResultSet describing the primary key columns of the table.
     */
    DatabaseMetaData.prototype.getPrimaryKeys = function (catalog, schema, table) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._dbm.getPrimaryKeysSync(catalog, schema, table)));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a description of the given catalog's stored procedure parameter and result columns.
     *
     * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
     * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
     * @param procedureNamePattern - A procedure name pattern; must match the procedure name as it is stored in the database; "" retrieves those without a procedure; null means that the procedure name should not be used to narrow the search
     * @param columnNamePattern - A column name pattern; must match the column name as it is stored in the database; "" retrieves those without a column; null means that the column name should not be used to narrow the search
     * @returns A promise that resolves to a ResultSet describing the procedure columns.
     */
    DatabaseMetaData.prototype.getProcedureColumns = function (catalog, schemaPattern, procedureNamePattern, columnNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._dbm.getProcedureColumnsSync(catalog, schemaPattern, procedureNamePattern, columnNamePattern)));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a description of the stored procedures available in the given catalog.
     *
     * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
     * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
     * @param procedureNamePattern - A procedure name pattern; must match the procedure name as it is stored in the database; "" retrieves those without a procedure; null means that the procedure name should not be used to narrow the search
     * @returns A promise that resolves to a ResultSet describing the procedures.
     */
    DatabaseMetaData.prototype.getProcedures = function (catalog, schemaPattern, procedureNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._dbm.getProceduresSync(catalog, schemaPattern, procedureNamePattern)));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves the database vendor's preferred term for "procedure".
     *
     * @returns A promise that resolves to the database vendor's preferred term for "procedure".
     */
    DatabaseMetaData.prototype.getProcedureTerm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getProcedureTermSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a description of the pseudo or hidden columns available in a given table.
     *
     * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
     * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
     * @param tableNamePattern - A table name pattern; must match the table name as it is stored in this database; "" retrieves those without a table; null means that the table name should not be used to narrow the search
     * @param columnNamePattern - A column name pattern; must match the column name as it is stored in the database; "" retrieves those without a column; null means that the column name should not be used to narrow the search
     * @returns A promise that resolves to a ResultSet describing the pseudo columns.
     */
    DatabaseMetaData.prototype.getPseudoColumns = function (catalog, schemaPattern, tableNamePattern, columnNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(new resultset_1["default"](_this._dbm.getPseudoColumnsSync(catalog, schemaPattern, tableNamePattern, columnNamePattern)));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves this database's default holdability for ResultSet objects.
     *
     * @returns A promise that resolves to the database's default holdability for ResultSet objects.
     */
    DatabaseMetaData.prototype.getResultSetHoldability = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getResultSetHoldabilitySync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Indicates whether this data source supports the SQL ROWID type.
     *
     * @returns A promise that resolves to the RowIdLifetime indicating if the data source supports the SQL ROWID type.
     */
    DatabaseMetaData.prototype.getRowIdLifetime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getRowIdLifetimeSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves the database vendor's preferred term for "schema".
     *
     * @returns A promise that resolves to the database vendor's preferred term for "schema".
     */
    DatabaseMetaData.prototype.getSchemaTerm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getSchemaTermSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves the string that can be used to escape wildcard characters.
     *
     * @returns A promise that resolves to the string used to escape wildcard characters.
     */
    DatabaseMetaData.prototype.getSearchStringEscape = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getSearchStringEscapeSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a comma-separated list of this database's SQL keywords.
     *
     * @returns A promise that resolves to the comma-separated list of SQL keywords.
     */
    DatabaseMetaData.prototype.getSQLKeywords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getSQLKeywordsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves the type of SQLSTATE returned by SQLException.getSQLState.
     *
     * @returns A promise that resolves to the type of SQLSTATE.
     */
    DatabaseMetaData.prototype.getSQLStateType = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getSQLStateTypeSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a comma-separated list of string functions available in this database.
     *
     * @returns A promise that resolves to the comma-separated list of string functions.
     */
    DatabaseMetaData.prototype.getStringFunctions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getStringFunctionsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a description of table hierarchies in a particular schema.
     *
     * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
     * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
     * @param tableNamePattern - A table name pattern; must match the table name as it is stored in this database; "" retrieves those without a table; null means that the table name should not be used to narrow the search
     * @returns A promise that resolves to a ResultSet describing the table hierarchies.
     */
    DatabaseMetaData.prototype.getSuperTables = function (catalog, schemaPattern, tableNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var validParams;
            var _this = this;
            return __generator(this, function (_a) {
                validParams = (catalog === null ||
                    catalog === undefined ||
                    typeof catalog === "string") &&
                    (schemaPattern === null ||
                        schemaPattern === undefined ||
                        typeof schemaPattern === "string") &&
                    (tableNamePattern === null ||
                        tableNamePattern === undefined ||
                        typeof tableNamePattern === "string");
                if (!validParams) {
                    return [2 /*return*/, Promise.reject(new Error("INVALID ARGUMENTS"))];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var result = _this._dbm.getSuperTablesSync(catalog, schemaPattern, tableNamePattern);
                            resolve(new resultset_1["default"](result));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a description of user-defined type (UDT) hierarchies in a schema.
     *
     * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
     * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
     * @param typeNamePattern - A type name pattern; must match the type name as it is stored in this database; "" retrieves those without a type; null means that the type name should not be used to narrow the search
     * @returns A promise that resolves to a ResultSet describing the UDT hierarchies.
     */
    DatabaseMetaData.prototype.getSuperTypes = function (catalog, schemaPattern, typeNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var validParams;
            var _this = this;
            return __generator(this, function (_a) {
                validParams = (catalog === null ||
                    catalog === undefined ||
                    typeof catalog === "string") &&
                    (schemaPattern === null ||
                        schemaPattern === undefined ||
                        typeof schemaPattern === "string") &&
                    (typeNamePattern === null ||
                        typeNamePattern === undefined ||
                        typeof typeNamePattern === "string");
                if (!validParams) {
                    return [2 /*return*/, Promise.reject(new Error("INVALID ARGUMENTS"))];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var result = _this._dbm.getSuperTypesSync(catalog, schemaPattern, typeNamePattern);
                            resolve(new resultset_1["default"](result));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a comma-separated list of system functions available in this database.
     *
     * @returns A promise that resolves to the comma-separated list of system functions.
     */
    DatabaseMetaData.prototype.getSystemFunctions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getSystemFunctionsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a description of the privileges defined for a table.
     *
     * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
     * @param schemaPattern - A schema pattern; must match the schema name as it is stored in this database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
     * @param tableNamePattern - A table name pattern; must match the table name as it is stored in this database; "" retrieves those without a table; null means that the table name should not be used to narrow the search
     * @returns A promise that resolves to a ResultSet describing the table privileges.
     */
    DatabaseMetaData.prototype.getTablePrivileges = function (catalog, schemaPattern, tableNamePattern) {
        return __awaiter(this, void 0, void 0, function () {
            var validParams;
            var _this = this;
            return __generator(this, function (_a) {
                validParams = (catalog === null ||
                    catalog === undefined ||
                    typeof catalog === "string") &&
                    (schemaPattern === null ||
                        schemaPattern === undefined ||
                        typeof schemaPattern === "string") &&
                    typeof tableNamePattern === "string";
                if (!validParams) {
                    return [2 /*return*/, Promise.reject(new Error("INVALID ARGUMENTS"))];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var result = _this._dbm.getTablePrivilegesSync(catalog, schemaPattern, tableNamePattern);
                            resolve(new resultset_1["default"](result));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a description of the table types available in this database.
     *
     * @returns A promise that resolves to a ResultSet describing the table types.
     */
    DatabaseMetaData.prototype.getTableTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var result = _this._dbm.getTableTypesSync();
                            resolve(new resultset_1["default"](result));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a comma-separated list of time and date functions available in this database.
     *
     * @returns A promise that resolves to a comma-separated list of time and date functions.
     */
    DatabaseMetaData.prototype.getTimeDateFunctions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            resolve(_this._dbm.getTimeDateFunctionsSync());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves type information for the database.
     *
     * @returns A promise that resolves to a ResultSet describing the type information.
     */
    DatabaseMetaData.prototype.getTypeInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var result = _this._dbm.getTypeInfoSync();
                            resolve(new resultset_1["default"](result));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves a description of user-defined types (UDTs) in a schema.
     *
     * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
     * @param schemaPattern - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
     * @param typeNamePattern - A type name pattern; must match the type name as it is stored in this database; "" retrieves those without a type; null means that the type name should not be used to narrow the search
     * @param types - An array of type codes; null retrieves all types
     * @returns A promise that resolves to a ResultSet describing the UDTs.
     */
    DatabaseMetaData.prototype.getUDTs = function (catalog, schemaPattern, typeNamePattern, types) {
        return __awaiter(this, void 0, void 0, function () {
            var validParams;
            var _this = this;
            return __generator(this, function (_a) {
                validParams = (catalog === null ||
                    catalog === undefined ||
                    typeof catalog === "string") &&
                    (schemaPattern === null ||
                        schemaPattern === undefined ||
                        typeof schemaPattern === "string") &&
                    (typeNamePattern === null ||
                        typeNamePattern === undefined ||
                        typeof typeNamePattern === "string") &&
                    (types === null ||
                        types === undefined ||
                        Array.isArray(types));
                if (!validParams) {
                    return [2 /*return*/, Promise.reject(new Error("INVALID ARGUMENTS"))];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            var result = _this._dbm.getUDTsSync(catalog, schemaPattern, typeNamePattern, types);
                            resolve(new resultset_1["default"](result));
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    /**
     * Retrieves the URL of the database.
     *
     * @returns A promise that resolves to the database URL.
     */
    DatabaseMetaData.prototype.getURL = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._dbm.getURLSync()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves the username associated with the database connection.
     *
     * @returns A promise that resolves to the username.
     */
    DatabaseMetaData.prototype.getUserName = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var result = _this._dbm.getUserNameSync();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Retrieves version columns for a given table.
     *
     * @param catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
     * @param schema - A schema pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
     * @param table - A table name; must match the table name as it is stored in this database
     * @returns A promise that resolves to a ResultSet describing the version columns.
     */
    DatabaseMetaData.prototype.getVersionColumns = function (catalog, schema, table) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var validParams = (catalog === null ||
                catalog === undefined ||
                typeof catalog === "string") &&
                (schema === null ||
                    schema === undefined ||
                    typeof schema === "string") &&
                typeof table === "string";
            if (!validParams) {
                reject(new Error("INVALID ARGUMENTS"));
                return;
            }
            try {
                var result = _this._dbm.getVersionColumnsSync(catalog, schema, table);
                resolve(new resultset_1["default"](result));
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if the database detects inserts.
     *
     * @param type - The type of insert to check
     * @returns A promise that resolves to a boolean indicating if inserts are detected.
     */
    DatabaseMetaData.prototype.insertsAreDetected = function (type) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!Number.isInteger(type)) {
                reject(new Error("INVALID ARGUMENTS"));
                return;
            }
            try {
                var result = _this._dbm.insertsAreDetectedSync(type);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if the catalog is at the start of the URL.
     *
     * @returns A promise that resolves to a boolean indicating if the catalog is at the start.
     */
    DatabaseMetaData.prototype.isCatalogAtStart = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var result = _this._dbm.isCatalogAtStartSync();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if the database is read-only.
     *
     * @returns A promise that resolves to a boolean indicating if the database is read-only.
     */
    DatabaseMetaData.prototype.isReadOnly = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var result = _this._dbm.isReadOnlySync();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if locators are updated when the database copy is updated.
     *
     * @returns A promise that resolves to a boolean indicating if locators are updated.
     */
    DatabaseMetaData.prototype.locatorsUpdateCopy = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var result = _this._dbm.locatorsUpdateCopySync();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if adding a NULL to a non-NULL value results in NULL.
     *
     * @returns A promise that resolves to a boolean indicating if NULL plus non-NULL is NULL.
     */
    DatabaseMetaData.prototype.nullPlusNonNullIsNull = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var result = _this._dbm.nullPlusNonNullIsNullSync();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if NULLs are sorted at the end.
     *
     * @returns A promise that resolves to a boolean indicating if NULLs are sorted at the end.
     */
    DatabaseMetaData.prototype.nullsAreSortedAtEnd = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var result = _this._dbm.nullsAreSortedAtEndSync();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if NULLs are sorted at the start.
     *
     * @returns A promise that resolves to a boolean indicating if NULLs are sorted at the start.
     */
    DatabaseMetaData.prototype.nullsAreSortedAtStart = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var result = _this._dbm.nullsAreSortedAtStartSync();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if NULLs are sorted high.
     *
     * @returns A promise that resolves to a boolean indicating if NULLs are sorted high.
     */
    DatabaseMetaData.prototype.nullsAreSortedHigh = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var result = _this._dbm.nullsAreSortedHighSync();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if NULLs are sorted low.
     *
     * @returns A promise that resolves to a boolean indicating if NULLs are sorted low.
     */
    DatabaseMetaData.prototype.nullsAreSortedLow = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var result = _this._dbm.nullsAreSortedLowSync();
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if other deletes are visible for a specific type.
     *
     * @param type - The type of visibility to check.
     * @returns A promise that resolves to a boolean indicating if other deletes are visible.
     */
    DatabaseMetaData.prototype.othersDeletesAreVisible = function (type) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!Number.isInteger(type)) {
                reject(new Error("INVALID ARGUMENTS"));
                return;
            }
            try {
                var result = _this._dbm.othersDeletesAreVisibleSync(type);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if other inserts are visible for a specific type.
     *
     * @param type - The type of visibility to check.
     * @returns A promise that resolves to a boolean indicating if other inserts are visible.
     */
    DatabaseMetaData.prototype.othersInsertsAreVisible = function (type) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!Number.isInteger(type)) {
                reject(new Error("INVALID ARGUMENTS"));
                return;
            }
            try {
                var result = _this._dbm.othersInsertsAreVisibleSync(type);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if other updates are visible for a specific type.
     *
     * @param type - The type of visibility to check.
     * @returns A promise that resolves to a boolean indicating if other updates are visible.
     */
    DatabaseMetaData.prototype.othersUpdatesAreVisible = function (type) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!Number.isInteger(type)) {
                reject(new Error("INVALID ARGUMENTS"));
                return;
            }
            try {
                var result = _this._dbm.othersUpdatesAreVisibleSync(type);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Checks if own deletes are visible for a specific type.
     *
     * @param type - The type of visibility to check.
     * @returns A promise that resolves to a boolean indicating if own deletes are visible.
     */
    DatabaseMetaData.prototype.ownDeletesAreVisible = function (type) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof type !== 'number') {
                reject(new Error("INVALID ARGUMENTS"));
                return;
            }
            try {
                var result = _this._dbm.ownDeletesAreVisibleSync(type);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.ownInsertsAreVisible = function (type) {
        var _this = this;
        if (typeof type !== 'number') {
            throw new Error("INVALID ARGUMENTS");
        }
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.ownInsertsAreVisibleSync(type));
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.ownUpdatesAreVisible = function (type) {
        var _this = this;
        if (typeof type !== 'number') {
            throw new Error("INVALID ARGUMENTS");
        }
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.ownUpdatesAreVisibleSync(type));
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.storesLowerCaseIdentifiers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.storesLowerCaseIdentifiersSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.storesLowerCaseQuotedIdentifiers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.storesLowerCaseQuotedIdentifiersSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.storesMixedCaseIdentifiers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.storesMixedCaseIdentifiersSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.storesMixedCaseQuotedIdentifiers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.storesMixedCaseQuotedIdentifiersSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.storesUpperCaseIdentifiers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.storesUpperCaseIdentifiersSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.storesUpperCaseQuotedIdentifiers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.storesUpperCaseQuotedIdentifiersSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsAlterTableWithAddColumn = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsAlterTableWithAddColumnSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsAlterTableWithDropColumn = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsAlterTableWithDropColumnSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsANSI92EntryLevelSQL = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsANSI92EntryLevelSQLSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsANSI92FullSQL = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsANSI92FullSQLSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsANSI92IntermediateSQL = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsANSI92IntermediateSQLSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsBatchUpdates = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsBatchUpdatesSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsCatalogsInDataManipulation = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsCatalogsInDataManipulationSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsCatalogsInIndexDefinitions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsCatalogsInIndexDefinitionsSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsCatalogsInPrivilegeDefinitions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsCatalogsInPrivilegeDefinitionsSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsCatalogsInProcedureCalls = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsCatalogsInProcedureCallsSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsCatalogsInTableDefinitions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsCatalogsInTableDefinitionsSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsColumnAliasing = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsColumnAliasingSync());
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DatabaseMetaData.prototype.supportsConvert = function (fromType, toType) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (typeof fromType !== 'number' || typeof toType !== 'number') {
                    throw new Error("INVALID ARGUMENTS");
                }
                resolve(_this._dbm.supportsConvertSync(fromType, toType));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsCoreSQLGrammar = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsCoreSQLGrammarSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsCorrelatedSubqueries = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsCorrelatedSubqueriesSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsDataDefinitionAndDataManipulationTransactions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsDataDefinitionAndDataManipulationTransactionsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsDataManipulationTransactionsOnly = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsDataManipulationTransactionsOnlySync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsDifferentTableCorrelationNames = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsDifferentTableCorrelationNamesSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsExpressionsInOrderBy = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsExpressionsInOrderBySync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsExtendedSQLGrammar = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsExtendedSQLGrammarSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsFullOuterJoins = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsFullOuterJoinsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsGetGeneratedKeys = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsGetGeneratedKeysSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsGroupBy = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsGroupBySync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsGroupByBeyondSelect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsGroupByBeyondSelectSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsGroupByUnrelated = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsGroupByUnrelatedSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsIntegrityEnhancementFacility = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsIntegrityEnhancementFacilitySync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsLikeEscapeClause = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsLikeEscapeClauseSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsLimitedOuterJoins = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsLimitedOuterJoinsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsMinimumSQLGrammar = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsMinimumSQLGrammarSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsMixedCaseIdentifiers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsMixedCaseIdentifiersSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsMixedCaseQuotedIdentifiers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsMixedCaseQuotedIdentifiersSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsMultipleOpenResults = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsMultipleOpenResultsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsMultipleResultSets = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsMultipleResultSetsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsMultipleTransactions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsMultipleTransactionsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsNamedParameters = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsNamedParametersSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsNonNullableColumns = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsNonNullableColumnsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsOpenCursorsAcrossCommit = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsOpenCursorsAcrossCommitSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsOpenCursorsAcrossRollback = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsOpenCursorsAcrossRollbackSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsOpenStatementsAcrossCommit = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsOpenStatementsAcrossCommitSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsOpenStatementsAcrossRollback = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsOpenStatementsAcrossRollbackSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsOrderByUnrelated = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsOrderByUnrelatedSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsOuterJoins = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsOuterJoinsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsPositionedDelete = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsPositionedDeleteSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsPositionedUpdate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsPositionedUpdateSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsResultSetConcurrency = function (type, concurrency) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!Number.isInteger(type) || !Number.isInteger(concurrency)) {
                    throw new Error("INVALID ARGUMENTS");
                }
                resolve(_this._dbm.supportsResultSetConcurrencySync(type, concurrency));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsResultSetHoldability = function (holdability) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!Number.isInteger(holdability)) {
                    throw new Error("INVALID ARGUMENTS");
                }
                resolve(_this._dbm.supportsResultSetHoldabilitySync(holdability));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsResultSetType = function (type) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!Number.isInteger(type)) {
                    throw new Error("INVALID ARGUMENTS");
                }
                resolve(_this._dbm.supportsResultSetTypeSync(type));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsStoredFunctions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsStoredFunctionsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsStoredProcedures = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsStoredProceduresSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsSubselects = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsSubselectsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsTransactionIsolationLevel = function (level) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!Number.isInteger(level)) {
                    throw new Error("INVALID ARGUMENTS");
                }
                resolve(_this._dbm.supportsTransactionIsolationLevelSync(level));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsTransactions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsTransactionsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    DatabaseMetaData.prototype.supportsUnions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                resolve(_this._dbm.supportsUnionsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    /**
     * Checks if SQL UNION ALL is supported.
     *
     * @returns A promise that resolves to a boolean indicating if SQL UNION ALL is supported.
     */
    DatabaseMetaData.prototype.supportsUnionAll = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this._dbm.supportsUnionAllSync());
        });
    };
    /**
     * Checks if updates are detected by calling the method ResultSet.rowUpdated.
     *
     * @param type - The ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
     * @returns A promise that resolves to a boolean indicating if updates are detected by the result set type.
     */
    DatabaseMetaData.prototype.updatesAreDetected = function (type) {
        var _this = this;
        if (!Number.isInteger(type)) {
            return Promise.reject(new Error("INVALID ARGUMENTS"));
        }
        return new Promise(function (resolve) {
            resolve(_this._dbm.updatesAreDetectedSync(type));
        });
    };
    /**
     * Checks if the database uses a file for each table.
     *
     * @returns A promise that resolves to a boolean indicating if the database uses a file for each table.
     */
    DatabaseMetaData.prototype.usesLocalFilePerTable = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this._dbm.usesLocalFilePerTableSync());
        });
    };
    /**
     * Checks if the database stores tables in local files.
     *
     * @returns A promise that resolves to a boolean indicating if the database stores tables in local files.
     */
    DatabaseMetaData.prototype.usesLocalFiles = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this._dbm.usesLocalFilesSync());
        });
    };
    return DatabaseMetaData;
}());
// Initializing static attributes from `java.sql.DatabaseMetaData`
var staticAttrs = [
    "attributeNoNulls",
    "attributeNullable",
    "attributeNullableUnknown",
    "bestRowNotPseudo",
    "bestRowPseudo",
    "bestRowSession",
    "bestRowTemporary",
    "bestRowTransaction",
    "bestRowUnknown",
    "columnNoNulls",
    "columnNullable",
    "columnNullableUnknown",
    "functionColumnIn",
    "functionColumnInOut",
    "functionColumnOut",
    "functionColumnResult",
    "functionColumnUnknown",
    "functionNoNulls",
    "functionNoTable",
    "functionNullable",
    "functionNullableUnknown",
    "functionResultUnknown",
    "functionReturn",
    "functionReturnsTable",
    "importedKeyCascade",
    "importedKeyInitiallyDeferred",
    "importedKeyInitiallyImmediate",
    "importedKeyNoAction",
    "importedKeyNotDeferrable",
    "importedKeyRestrict",
    "importedKeySetDefault",
    "importedKeySetNull",
    "procedureColumnIn",
    "procedureColumnInOut",
    "procedureColumnOut",
    "procedureColumnResult",
    "procedureColumnReturn",
    "procedureColumnUnknown",
    "procedureNoNulls",
    "procedureNoResult",
    "procedureNullable",
    "procedureNullableUnknown",
    "procedureResultUnknown",
    "procedureReturnsResult",
    "sqlStateSQL",
    "sqlStateSQL99",
    "sqlStateXOpen",
    "tableIndexClustered",
    "tableIndexHashed",
    "tableIndexOther",
    "tableIndexStatistic",
    "typeNoNulls",
    "typeNullable",
    "typeNullableUnknown",
    "typePredBasic",
    "typePredChar",
    "typePredNone",
    "typeSearchable",
    "versionColumnNotPseudo",
    "versionColumnPseudo",
    "versionColumnUnknown",
];
jinst_1["default"].getInstance().events.once("initialized", function () {
    // Assuming 'java' is an external library object with a method to get static field values
    staticAttrs.forEach(function (attr) {
        DatabaseMetaData[attr] =
            java.getStaticFieldValue("java.sql.DatabaseMetaData", attr);
    });
});
exports["default"] = DatabaseMetaData;

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
var preparedstatement_1 = require("./preparedstatement");
var statement_1 = require("./statement");
var java = jinst_1["default"].getInstance();
if (!java.isJvmCreated()) {
    java.addOption("-Xrs");
}
var Connection = /** @class */ (function () {
    function Connection(conn) {
        var _this = this;
        this.asyncExecutor = function (task) {
            setTimeout(task, 0); // Executes the task asynchronously
        };
        // prepareStatement (
        //   sql: string,
        //   arg1?: number | number[] | string[],
        //   arg2?: number,
        //   arg3?: number,
        // ): Promise<any> {
        //   return new Promise((resolve, reject) => {
        //     // Check that `sql` is provided
        //     if (!sql) {
        //       return reject(new Error('INVALID ARGUMENTS'));
        //     }
        //     // Validate additional arguments (arg1, arg2, arg3)
        //     const validateArgs = (args: any[]): boolean => {
        //       return args.every((arg, idx) => {
        //         if (idx === 0 && Array.isArray(arg) && args.length === 1) {
        //           return arg.every(item => typeof item === 'string' || typeof item === 'number');
        //         }
        //         return typeof arg === 'number';
        //       });
        //     };
        //     // Collect only defined arguments
        //     const args = [sql, arg1, arg2, arg3].filter(arg => arg !== undefined) as [
        //       string,
        //       number | number[] | string[],
        //       number?,
        //       number?
        //     ];
        //     if (!validateArgs(args.slice(1))) {
        //       return reject(new Error('INVALID ARGUMENTS'));
        //     }
        //     // Call `prepareStatement` with explicit arguments and a callback for handling the result
        //     this._conn?.prepareStatement(
        //       args[0],
        //       args[1],
        //       args[2],
        //       args[3],
        //       (err: Error | null, ps: any) => {
        //         if (err) {
        //           reject(err);
        //         } else {
        //           resolve(new PreparedStatement(ps));
        //         }
        //       }
        //     );
        //   });
        // };
        this.prepareStatement = function (sql, arg1) {
            return new Promise(function (resolve, reject) {
                // Check arg1, arg2, and arg3 for validity.  These arguments must
                // be numbers if given, except for the special case when the first
                // of these arguments is an array and no other arguments are given.
                // In this special case, the array must be a string or number array.
                //
                // NOTE: _.tail returns all but the first argument, so we are only
                // processing arg1, arg2, and arg3; and not sql (or callback, which
                // was already removed from the args array).
                var _a;
                // if (invalidArgs) {
                //   return reject(new Error(errMsg));
                // }
                // Push a callback handler onto the arguments
                // args.push(function (err, ps) {
                //   if (err) {
                //     return callback(err);
                //   } else {
                //     return callback(null, new PreparedStatement(ps));
                //   }
                // });
                // Forward modified arguments to _conn.prepareStatement
                try {
                    resolve(new preparedstatement_1["default"]((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.prepareStatementSync(sql)));
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this._conn = conn;
        this._txniso = this.initializeTxnIso();
    }
    Connection.prototype.initializeTxnIso = function () {
        var txniso = {};
        txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_NONE")] = "TRANSACTION_NONE";
        txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_READ_COMMITTED")] = "TRANSACTION_READ_COMMITTED";
        txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_READ_UNCOMMITTED")] = "TRANSACTION_READ_UNCOMMITTED";
        txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_REPEATABLE_READ")] = "TRANSACTION_REPEATABLE_READ";
        txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_SERIALIZABLE")] = "TRANSACTION_SERIALIZABLE";
        return txniso;
    };
    Connection.prototype.isClosedSync = function () {
        return this.isClosedSync();
    };
    Connection.prototype.isReadOnlySync = function () {
        return this.isReadOnlySync();
    };
    Connection.prototype.isValidSync = function (val) {
        return this.isValidSync(val);
    };
    Connection.prototype.abort = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var executor, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        executor = this.asyncExecutor(function () { });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        if (!((_a = this._conn) === null || _a === void 0 ? void 0 : _a.abortSync)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._conn.abortSync(executor)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        console.log("Abort method is not supported by this driver.");
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        console.error("Error aborting connection:", error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Connection.prototype.clearWarnings = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.clearWarningsSync());
        });
    };
    Connection.prototype.close = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.closeSync());
        });
    };
    Connection.prototype.commit = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.commitSync());
        });
    };
    Connection.prototype.commitSync = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.commitSync());
        });
    };
    Connection.prototype.createArrayOf = function (typename, objarr) {
        return Promise.reject(new Error("NOT IMPLEMENTED"));
    };
    Connection.prototype.createBlob = function () {
        return Promise.reject(new Error("NOT IMPLEMENTED"));
    };
    Connection.prototype.createClob = function () {
        return Promise.reject(new Error("NOT IMPLEMENTED"));
    };
    Connection.prototype.createNClob = function () {
        return Promise.reject(new Error("NOT IMPLEMENTED"));
    };
    Connection.prototype.createSQLXML = function () {
        return Promise.reject(new Error("NOT IMPLEMENTED"));
    };
    Connection.prototype.createStatement = function (arg1, arg2, arg3) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                var args = [arg1, arg2, arg3].filter(function (arg) { return arg !== undefined; }); // Filter out undefined arguments
                var statement = (_a = _this._conn) === null || _a === void 0 ? void 0 : _a.createStatementSync.apply(_a, args); // Invoke without callback
                resolve(new statement_1["default"](statement)); // Assume createStatement returns a statement
            }
            catch (err) {
                reject(err); // Handle any errors that occur during the call
            }
        });
    };
    Connection.prototype.createStruct = function (typename, attrarr) {
        return Promise.reject(new Error("NOT IMPLEMENTED"));
    };
    Connection.prototype.getAutoCommit = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.getAutoCommitSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.getCatalog = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.getCatalogSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.getClientInfo = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.getClientInfoSync(name));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.getHoldability = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.getHoldabilitySync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.getMetaData = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.getMetaDataSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.getNetworkTimeout = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.getNetworkTimeoutSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.getSchema = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.getSchemaSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.getTransactionIsolation = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.getTransactionIsolationSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.getTypeMap = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.getTypeMapSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.getWarnings = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.getWarningsSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.isClosed = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.isClosedSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.isReadOnly = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.isReadOnlySync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.isValid = function (timeout) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.isValidSync(timeout));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.prepareCall = function (sql, rstype, rsconcurrency, rsholdability) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.prepareCallSync(sql, rstype, rsconcurrency, rsholdability));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.releaseSavepoint = function (savepoint) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.releaseSavepointSync(savepoint));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.rollback = function (savepoint) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.rollbackSync(savepoint));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.setAutoCommit = function (autocommit) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.setAutoCommitSync(autocommit));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.setCatalog = function (catalog) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.setCatalogSync(catalog));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.setClientInfo = function (props, name, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.setClientInfoSync(props, name, value));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.setHoldability = function (holdability) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.setHoldabilitySync(holdability));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.setReadOnly = function (readonly) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.setReadOnlySync(readonly));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.setSavepoint = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.setSavepointSync());
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.setSchema = function (schema) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.setSchemaSync(schema));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.setTransactionIsolation = function (txniso) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.setTransactionIsolationSync(txniso));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    Connection.prototype.setTypeMap = function (map) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a;
            try {
                resolve((_a = _this._conn) === null || _a === void 0 ? void 0 : _a.setTypeMapSync(map));
            }
            catch (error) {
                reject(error);
            }
        });
    };
    return Connection;
}());
exports["default"] = Connection;

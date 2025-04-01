"use strict";
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
var events_1 = require("events");
var java = require('java');
function isJvmCreated() {
    // return typeof java.onJvmCreated !== 'function';
    return java.isJvmCreated();
}
// const jinst: Jinst = {
//   isJvmCreated: function(): boolean {
//     return isJvmCreated();
//   },
//   addOption: function(option: string): void {
//     if (!isJvmCreated() && option) {
//       java.options.push(option);
//     } else if (isJvmCreated()) {
//       console.error("You've tried to add an option to an already running JVM!");
//       console.error("This isn't currently supported. Please add all option entries before calling any java methods");
//       console.error("You can test for a running JVM with the isJvmCreated function.");
//     }
//   },
//   setupClasspath: function(dependencyArr: string[]): void {
//     if (!isJvmCreated() && dependencyArr) {
//       java.classpath.push(...dependencyArr);
//     } else if (isJvmCreated()) {
//       console.error("You've tried to add an entry to the classpath of an already running JVM!");
//       console.error("This isn't currently supported. Please add all classpath entries before calling any java methods");
//       console.error("You can test for a running JVM with the isJvmCreated function.");
//     }
//   },
//   getInstance: function(): typeof java {
//     return java;
//   },
//   events: new EventEmitter(),
// };
var Jinst = /** @class */ (function () {
    function Jinst() {
        // Event emitter
        this.events = new events_1.EventEmitter();
    }
    // Singleton access method
    Jinst.getInstance = function () {
        if (!Jinst.instance) {
            Jinst.instance = new Jinst();
        }
        return Jinst.instance;
    };
    // Method to check if the JVM is created
    Jinst.prototype.isJvmCreated = function () {
        return isJvmCreated();
    };
    // Method to add JVM options
    Jinst.prototype.addOption = function (option) {
        if (!isJvmCreated() && option) {
            java.options.push(option);
        }
        else if (isJvmCreated()) {
            console.error("You've tried to add an option to an already running JVM!");
            console.error("This isn't currently supported. Please add all option entries before calling any java methods");
            console.error("You can test for a running JVM with the isJvmCreated function.");
        }
    };
    // Method to set up the JVM classpath
    Jinst.prototype.setupClasspath = function (dependencyArr) {
        var _a;
        if (!isJvmCreated() && dependencyArr) {
            (_a = java.classpath).push.apply(_a, dependencyArr);
        }
        else if (isJvmCreated()) {
            console.error("You've tried to add an entry to the classpath of an already running JVM!");
            console.error("This isn't currently supported. Please add all classpath entries before calling any java methods");
            console.error("You can test for a running JVM with the isJvmCreated function.");
        }
    };
    // Method to access the JVM instance
    Jinst.prototype.getJavaInstance = function () {
        return java;
    };
    Jinst.prototype.getStaticFieldValue = function (className, fieldName) {
        return java.getStaticFieldValue(className, fieldName);
    };
    Jinst.prototype.callStaticMethod = function (className, methodName) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return java.callStaticMethodSync.apply(java, __spreadArray([className, methodName], args, false));
    };
    Jinst.prototype.callStaticMethodSync = function (className, methodName) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return java.callStaticMethodSync.apply(java, __spreadArray([className, methodName], args, true));
    };
    Jinst.prototype["import"] = function (className) {
        return java["import"](className); // Assuming `java.import` exists in the library
    };
    Jinst.prototype.newInstance = function (className) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            resolve(java.newInstanceSync.apply(java, __spreadArray([className], args, false)));
        });
    };
    Jinst.instance = null;
    return Jinst;
}());
exports["default"] = Jinst;

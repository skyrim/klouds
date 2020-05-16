(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["klouds"] = factory();
	else
		root["klouds"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/graphics.ts":
/*!*************************!*\
  !*** ./src/graphics.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.resizeCanvasToDisplaySize = exports.createProgram = exports.createShader = exports.ShaderType = exports.createContext = void 0;
function createContext(canvas) {
    return canvas.getContext('webgl');
}
exports.createContext = createContext;
var ShaderType;
(function (ShaderType) {
    ShaderType[ShaderType["VERTEX"] = 0] = "VERTEX";
    ShaderType[ShaderType["FRAGMENT"] = 1] = "FRAGMENT";
})(ShaderType = exports.ShaderType || (exports.ShaderType = {}));
function createShader(gl, type, source) {
    var shader = type === ShaderType.VERTEX
        ? gl.createShader(gl.VERTEX_SHADER)
        : gl.createShader(gl.FRAGMENT_SHADER);
    if (!shader) {
        console.error('Failed to create WebGL shader');
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.debug(gl.getShaderInfoLog(shader));
        console.error('Failed to compile WebGL shader');
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
exports.createShader = createShader;
function createProgram(gl, vertShaderSrc, fragShaderSrc, attributeNames, uniformNames) {
    var program = gl.createProgram();
    if (!program) {
        console.error('Failed to create WebGL program');
        return null;
    }
    var vertexShader = createShader(gl, ShaderType.VERTEX, vertShaderSrc);
    var fragmentShader = createShader(gl, ShaderType.FRAGMENT, fragShaderSrc);
    if (!vertexShader || !fragmentShader) {
        console.error('Failed to create a shader while creating a program');
        return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        console.error("Failed to link WebGL program");
        console.debug(gl.getProgramInfoLog(program));
        return null;
    }
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        console.error("Failed to validate WebGL program");
        console.debug(gl.getProgramInfoLog(program));
        return null;
    }
    var attributes = {};
    for (var i = 0; i < attributeNames.length; ++i) {
        var name_1 = attributeNames[i];
        var attr = gl.getAttribLocation(program, name_1);
        if (attr === -1) {
            console.error("Program attribute named \"" + name_1 + "\" doesn't exist");
            gl.deleteProgram(program);
            return null;
        }
        attributes[name_1] = attr;
    }
    var uniforms = {};
    for (var i = 0; i < uniformNames.length; ++i) {
        var name_2 = uniformNames[i];
        var uniform = gl.getUniformLocation(program, name_2);
        if (uniform === null) {
            console.error("Program uniform named \"" + name_2 + "\" doesn't exist");
            gl.deleteProgram(program);
            return null;
        }
        uniforms[name_2] = uniform;
    }
    return {
        handle: program,
        attributes: attributes,
        uniforms: uniforms
    };
}
exports.createProgram = createProgram;
function resizeCanvasToDisplaySize(canvas) {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}
exports.resizeCanvasToDisplaySize = resizeCanvasToDisplaySize;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.create = exports.Klouds = exports.VERSION = void 0;
var shader_vert_1 = __webpack_require__(/*! ./shader.vert */ "./src/shader.vert");
var shader_frag_1 = __webpack_require__(/*! ./shader.frag */ "./src/shader.frag");
var graphics_1 = __webpack_require__(/*! ./graphics */ "./src/graphics.ts");
exports.VERSION = "2.1.0";
function normalizeColor(color) {
    var div = document.createElement('div');
    div.style.display = 'none';
    div.style.color = color;
    document.body.appendChild(div);
    var strColors = getComputedStyle(div).color || 'rgb(0, 0, 0)';
    var numColors = strColors.match(/[+-]?\d+(\.\d+)?/g);
    var intColors = numColors
        ? numColors.map(function (a) { return parseInt(a, 10); })
        : [0, 0, 0];
    if (div.parentElement) {
        div.parentElement.removeChild(div);
    }
    if (intColors.length > 3) {
        intColors.length = 3;
    }
    else if (intColors.length < 3) {
        return [0, 0, 0];
    }
    return intColors;
}
function parseColor(color) {
    var result = [0, 0, 0];
    if (typeof color === 'string') {
        normalizeColor(color).forEach(function (color, idx) {
            result[idx] = color / 255;
        });
    }
    else if (Array.isArray(color) && color.length === 3) {
        color.slice(0, 3).forEach(function (color, idx) {
            result[idx] = color / 255;
        });
    }
    return result;
}
var Klouds = /** @class */ (function () {
    function Klouds(options) {
        var _this = this;
        this.isRunning = false;
        this.accumTime = 0;
        this.lastTime = performance.now();
        this.render = function (time) {
            var gl = _this.gl;
            var program = _this.program;
            var buffer = _this.buffer;
            var dt = (time - _this.lastTime) * _this.speed * 0.001;
            _this.accumTime += dt;
            _this.lastTime = time;
            graphics_1.resizeCanvasToDisplaySize(_this.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.useProgram(program.handle);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var posAttrib = program.attributes['position'];
            gl.enableVertexAttribArray(posAttrib);
            gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
            gl.uniform2f(program.uniforms['resolution'], gl.canvas.width, gl.canvas.height);
            gl.uniform1f(program.uniforms['layerCount'], _this.layerCount);
            gl.uniform1f(program.uniforms['time'], _this.accumTime);
            gl.uniform3fv(program.uniforms['bgColor'], _this.bgColor);
            gl.uniform3fv(program.uniforms['cloudColor1'], _this.cloudColor1);
            gl.uniform3fv(program.uniforms['cloudColor2'], _this.cloudColor2);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            if (_this.isRunning) {
                requestAnimationFrame(_this.render);
            }
        };
        var canvas = this.queryRootElement(options.selector);
        if (!canvas) {
            throw new Error("Invalid options.selector value passed to Klouds");
        }
        this.canvas = canvas;
        var speed = options.speed || 1;
        var layerCount = options.layerCount || 5;
        var cloudColor1 = options.cloudColor1 || [25, 178, 204];
        var cloudColor2 = options.cloudColor2 || [255, 255, 255];
        var bgColor = options.bgColor || [0, 102, 128];
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        this.initGraphics(canvas);
        this.setSpeed(speed);
        this.setLayerCount(layerCount);
        this.setBgColor(bgColor);
        this.setCloudColor1(cloudColor1);
        this.setCloudColor2(cloudColor2);
        this.start();
    }
    Klouds.prototype.queryRootElement = function (selector) {
        if (typeof selector === 'string') {
            var element = document.querySelector(selector);
            if (!element) {
                console.error('options.selector element not found');
                return null;
            }
            else if (!(element instanceof HTMLCanvasElement)) {
                console.error('options.selector element is not a <canvas> element');
                return null;
            }
            else {
                return element;
            }
        }
        else if (selector instanceof HTMLElement) {
            if (selector instanceof HTMLCanvasElement) {
                return selector;
            }
            else {
                console.error('options.selector element is not a <canvas> element');
                return null;
            }
        }
        else {
            console.error('options.selector value is invalid');
            return null;
        }
    };
    Klouds.prototype.initGraphics = function (canvas) {
        var gl = graphics_1.createContext(canvas);
        if (!gl) {
            throw new Error('Failed to create WebGL context');
        }
        var program = graphics_1.createProgram(gl, shader_vert_1["default"], shader_frag_1["default"], ['position'], [
            'resolution',
            'layerCount',
            'time',
            'bgColor',
            'cloudColor1',
            'cloudColor2'
        ]);
        if (!program) {
            throw new Error('Failed to create WebGL program');
        }
        var buffer = gl.createBuffer();
        if (!buffer) {
            gl.deleteProgram(program);
            throw new Error('Failed to create WebGL buffer');
        }
        var posAttrib = program.attributes['position'];
        gl.enableVertexAttribArray(posAttrib);
        gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
        var bufferData = [
            [-1, -1, 0],
            [1, -1, 0],
            [-1, 1, 0],
            [-1, 1, 0],
            [1, -1, 0],
            [1, 1, 0]
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData.reduce(function (prev, cur) { return prev.concat(cur); }, [])), gl.STATIC_DRAW);
        this.gl = gl;
        this.program = program;
        this.buffer = buffer;
    };
    Klouds.prototype.start = function () {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        requestAnimationFrame(this.render);
    };
    Klouds.prototype.stop = function () {
        this.isRunning = false;
    };
    Klouds.prototype.setSpeed = function (speed) {
        this.speed = Math.max(-100, Math.min(100, speed));
    };
    Klouds.prototype.setCloudColor1 = function (color) {
        var c = parseColor(color);
        if (c) {
            this.cloudColor1 = c;
        }
    };
    Klouds.prototype.setCloudColor2 = function (color) {
        var c = parseColor(color);
        if (c) {
            this.cloudColor2 = c;
        }
    };
    Klouds.prototype.setBgColor = function (color) {
        var c = parseColor(color);
        if (c) {
            this.bgColor = c;
        }
    };
    Klouds.prototype.setLayerCount = function (count) {
        this.layerCount = Math.max(1, Math.min(8, count)) / 10;
    };
    Klouds.prototype.getSpeed = function () {
        return this.speed;
    };
    Klouds.prototype.getLayerCount = function () {
        return this.layerCount;
    };
    Klouds.prototype.getBgColor = function () {
        return this.bgColor.slice();
    };
    Klouds.prototype.getCloudColor1 = function () {
        return this.cloudColor1.slice();
    };
    Klouds.prototype.getCloudColor2 = function () {
        return this.cloudColor2.slice();
    };
    return Klouds;
}());
exports.Klouds = Klouds;
function create(options) {
    return new Klouds(options);
}
exports.create = create;
if (window && typeof window.jQuery !== 'undefined') {
    ;
    window.jQuery.fn.Klouds = function (options) {
        options = options || {};
        var elements = this.get();
        var skies = [];
        for (var i = 0; i < elements.length; ++i) {
            options.selector = elements[i];
            skies.push(new Klouds(options));
        }
        return skies;
    };
}


/***/ }),

/***/ "./src/shader.frag":
/*!*************************!*\
  !*** ./src/shader.frag ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("precision mediump float;\r\n\r\nuniform vec2 resolution;\r\nuniform float layerCount;\r\nuniform float time;\r\nuniform vec3 bgColor;\r\nuniform vec3 cloudColor1;\r\nuniform vec3 cloudColor2;\r\n\r\n#define TAU 6.28318530718\r\n\r\nfloat func(float pX) {\r\n    return 0.6 * (0.5 * sin(0.1 * pX) + 0.5 * sin(0.553 * pX) + 0.7 * sin(1.2 * pX));\r\n}\r\n\r\nfloat funcR(float pX) {\r\n    return 0.5 + 0.25 * (1.0 + sin(mod(40.0 * pX, TAU)));\r\n}\r\n\r\nfloat layer(vec2 pQ, float pT) {\r\n    vec2 Qt = 3.5 * pQ;\r\n    pT *= 0.5;\r\n    Qt.x += pT;\r\n\r\n    float Xi = floor(Qt.x);\r\n    float Xf = Qt.x - Xi - 0.5;\r\n\r\n    vec2 C;\r\n    float Yi;\r\n    float D = 1.0 - step(Qt.y,  func(Qt.x));\r\n\r\n    Yi = func(Xi + 0.5);\r\n    C = vec2(Xf, Qt.y - Yi ); \r\n    D =  min(D, length(C) - funcR(Xi + pT / 80.0));\r\n\r\n    Yi = func(Xi + 1.0 + 0.5);\r\n    C = vec2(Xf - 1.0, Qt.y - Yi ); \r\n    D =  min(D, length(C) - funcR(Xi + 1.0+ pT / 80.0));\r\n\r\n    Yi = func(Xi - 1.0 + 0.5);\r\n    C = vec2(Xf + 1.0, Qt.y - Yi ); \r\n    D =  min(D, length(C) - funcR(Xi - 1.0 + pT / 80.0));\r\n\r\n    return min(1.0, D);\r\n}\r\n\r\nvoid main() {\r\n    float t = time;\r\n    vec2 UV = 2.0 * (gl_FragCoord.xy - resolution.xy / 2.0) / min(resolution.x, resolution.y);\t\r\n    \r\n    vec3 Color = bgColor;\r\n\r\n    for(float i = 0.0; i < 0.8; i += 0.1) {\r\n        if (i >= layerCount) {\r\n            break;\r\n        }\r\n\r\n        float Lt =  t * (0.5 + 2.0 * i) * (1.0 + 0.1 * sin(226.0 * i)) + 1000.0 * i;\r\n        vec2 Lp = vec2(100.0 * i, 0.8 * (i / (layerCount - 0.0999) / 0.8) - 0.3);\r\n        float L = layer(UV + Lp, Lt);\r\n\r\n        float Blur = 4.0 * (0.5 * abs(2.0 - 5.0 * i)) / (11.0 - 5.0 * i);\r\n\r\n        float V = mix(0.0, 1.0, 1.0 - smoothstep(0.0, 0.01 + 0.2 * Blur, L));\r\n        vec3 Lc = mix(cloudColor1, cloudColor2, i / (layerCount - 0.0999) / 0.8);\r\n\r\n        Color = mix(Color, Lc,  V);\r\n    }\r\n\r\n    gl_FragColor = vec4(Color, 1.0);\r\n}\r\n");

/***/ }),

/***/ "./src/shader.vert":
/*!*************************!*\
  !*** ./src/shader.vert ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("attribute vec3 position;\r\n\r\nvoid main() {\r\n    gl_Position = vec4(position, 1.0);\r\n}\r\n");

/***/ })

/******/ });
});
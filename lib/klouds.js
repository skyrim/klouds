(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["klouds"] = factory();
	else
		root["klouds"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shader.frag":
/*!*************************!*\
  !*** ./src/shader.frag ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;\n\nuniform vec2 resolution;\nuniform float layerCount;\nuniform float time;\nuniform vec3 bgColor;\nuniform vec3 cloudColor1;\nuniform vec3 cloudColor2;\n\n#define TAU 6.28318530718\n\nfloat func(float pX) {\n    return 0.6 * (0.5 * sin(0.1 * pX) + 0.5 * sin(0.553 * pX) + 0.7 * sin(1.2 * pX));\n}\n\nfloat funcR(float pX) {\n    return 0.5 + 0.25 * (1.0 + sin(mod(40.0 * pX, TAU)));\n}\n\nfloat layer(vec2 pQ, float pT) {\n    vec2 Qt = 3.5 * pQ;\n    pT *= 0.5;\n    Qt.x += pT;\n\n    float Xi = floor(Qt.x);\n    float Xf = Qt.x - Xi - 0.5;\n\n    vec2 C;\n    float Yi;\n    float D = 1.0 - step(Qt.y,  func(Qt.x));\n\n    Yi = func(Xi + 0.5);\n    C = vec2(Xf, Qt.y - Yi ); \n    D =  min(D, length(C) - funcR(Xi + pT / 80.0));\n\n    Yi = func(Xi + 1.0 + 0.5);\n    C = vec2(Xf - 1.0, Qt.y - Yi ); \n    D =  min(D, length(C) - funcR(Xi + 1.0+ pT / 80.0));\n\n    Yi = func(Xi - 1.0 + 0.5);\n    C = vec2(Xf + 1.0, Qt.y - Yi ); \n    D =  min(D, length(C) - funcR(Xi - 1.0 + pT / 80.0));\n\n    return min(1.0, D);\n}\n\nvoid main() {\n    float t = time;\n    vec2 UV = 2.0 * (gl_FragCoord.xy - resolution.xy / 2.0) / min(resolution.x, resolution.y);\t\n    \n    vec3 Color = bgColor;\n\n    for(float i = 0.0; i < 0.8; i += 0.1) {\n        if (i >= layerCount) {\n            break;\n        }\n\n        float Lt =  t * (0.5 + 2.0 * i) * (1.0 + 0.1 * sin(226.0 * i)) + 1000.0 * i;\n        vec2 Lp = vec2(100.0 * i, 0.8 * (i / (layerCount - 0.0999) / 0.8) - 0.3);\n        float L = layer(UV + Lp, Lt);\n\n        float Blur = 4.0 * (0.5 * abs(2.0 - 5.0 * i)) / (11.0 - 5.0 * i);\n\n        float V = mix(0.0, 1.0, 1.0 - smoothstep(0.0, 0.01 + 0.2 * Blur, L));\n        vec3 Lc = mix(cloudColor1, cloudColor2, i / (layerCount - 0.0999) / 0.8);\n\n        Color = mix(Color, Lc,  V);\n    }\n\n    gl_FragColor = vec4(Color, 1.0);\n}\n");

/***/ }),

/***/ "./src/shader.vert":
/*!*************************!*\
  !*** ./src/shader.vert ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec3 position;\n\nvoid main() {\n    gl_Position = vec4(position, 1.0);\n}\n");

/***/ }),

/***/ "./src/graphics.ts":
/*!*************************!*\
  !*** ./src/graphics.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShaderType = void 0;
exports.createContext = createContext;
exports.createShader = createShader;
exports.createProgram = createProgram;
exports.resizeCanvasToDisplaySize = resizeCanvasToDisplaySize;
function createContext(canvas) {
    return canvas.getContext('webgl');
}
var ShaderType;
(function (ShaderType) {
    ShaderType[ShaderType["VERTEX"] = 0] = "VERTEX";
    ShaderType[ShaderType["FRAGMENT"] = 1] = "FRAGMENT";
})(ShaderType || (exports.ShaderType = ShaderType = {}));
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
            console.error("Program attribute named \"".concat(name_1, "\" doesn't exist"));
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
            console.error("Program uniform named \"".concat(name_2, "\" doesn't exist"));
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Klouds = exports.VERSION = void 0;
exports.create = create;
var shader_vert_1 = __webpack_require__(/*! ./shader.vert */ "./src/shader.vert");
var shader_frag_1 = __webpack_require__(/*! ./shader.frag */ "./src/shader.frag");
var graphics_1 = __webpack_require__(/*! ./graphics */ "./src/graphics.ts");
exports.VERSION = "3.0.0";
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
            (0, graphics_1.resizeCanvasToDisplaySize)(_this.canvas);
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
        var gl = (0, graphics_1.createContext)(canvas);
        if (!gl) {
            throw new Error('Failed to create WebGL context');
        }
        var program = (0, graphics_1.createProgram)(gl, shader_vert_1.default, shader_frag_1.default, ['position'], [
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

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
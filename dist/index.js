/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 773:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 438:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
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
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(773);
const github = __nccwpck_require__(438);
const path = __nccwpck_require__(17);
const fs = __nccwpck_require__(147);
const crypto = __nccwpck_require__(113);

const algo = "aes-256-cbc";
const initVector = Buffer.alloc(16, 0);

const encryptData = (data, secret, filePath) => {
  const cipher = crypto.createCipheriv(algo, secret, initVector);

  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");

  fs.writeFileSync(filePath, encrypted);
};

const decryptData = (data, secret, filePath) => {
  const decipher = crypto.createDecipheriv(algo, secret, initVector);

  let decrypted = decipher.update(data.toString(), "hex", "utf8");
  decrypted += decipher.final("utf8");

  fs.writeFileSync(filePath, decrypted);
};

try {
  const inputFilePath = core.getInput("input-file-path");
  const secret = core.getInput("encrypt-secret");
  const mode = core.getInput("mode");

  const filePath = path.join(__dirname, inputFilePath);
  const data = fs.readFileSync(path.basename(filePath));

  if (mode === "encryption") encryptData(data, secret, filePath);
  else if (mode === "decryption") decryptData(data, secret, filePath);

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
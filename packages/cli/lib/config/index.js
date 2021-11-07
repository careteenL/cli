"use strict";

var _rc = require("../utils/rc");

module.exports = async (action, k, v) => {
  // eslint-disable-next-line default-case
  switch (action) {
    case 'get':
      if (k) {
        const key = await (0, _rc.get)(k);
        console.log(key);
      } else {
        const obj = await (0, _rc.getAll)();
        Object.keys(obj).forEach(key => {
          console.log(`${key}=${obj[key]}`);
        });
      }

      break;

    case 'set':
      (0, _rc.set)(k, v);
      break;

    case 'remove':
      (0, _rc.remove)(k);
      break;
  }
};
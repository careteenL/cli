"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const writeFileTree = async (dir, files) => {
  Object.keys(files).forEach(name => {
    const filePath = _path.default.join(dir, name);

    _fsExtra.default.ensureDirSync(_path.default.dirname(filePath));

    _fsExtra.default.writeFileSync(filePath, files[name]);

    console.log(`${_chalk.default.green(name)} write done .`);
  });
};

var _default = writeFileTree;
exports.default = _default;
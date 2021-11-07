"use strict";

var _inquirer = _interopRequireDefault(require("inquirer"));

var _path = _interopRequireDefault(require("path"));

var _util = require("../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async materialName => {
  const materials = (0, _util.getDirName)(__dirname);
  const {
    materialType
  } = await _inquirer.default.prompt({
    name: 'materialType',
    type: 'list',
    message: 'please choose a type to add material',
    choices: materials
  });

  require(_path.default.resolve(__dirname, materialType))(materialName);
};